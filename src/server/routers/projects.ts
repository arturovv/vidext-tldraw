import db from "@/db";
import { GetSnapshotSchema, NewProjectSchema, projects, UpdateProjectSchema, UpdateSnapshotSchema } from "@/db/schema/projects";
import { and, eq } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import fs from 'fs/promises';
import path from 'path';
import { auth } from "@/auth";

export const projectsRouter = router({
    getSnapshotById: publicProcedure.input(GetSnapshotSchema).query(async ({ input, ctx }) => {
        // check if project exists and it's public
        const project = await db.select().from(projects).where(eq(projects.id, input.id)).limit(1);
        if (project.length === 0) {
            throw new TRPCError({ code: 'NOT_FOUND' });
        }

        const session = await auth()
        if (project[0].userId !== session?.user?.id && !project[0].isPublic) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        // return the snapshot json file
        const dataFilePath = path.join(process.cwd(), `data/${project[0].id}.json`);
        try {
            return JSON.parse(await fs.readFile(dataFilePath, 'utf-8'));
        } catch (error) {
            console.error(error)
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }
    }),
    getUserActiveProject: protectedProcedure.query(async ({ ctx }) => {
        const project = await db.select().from(projects).where(and(eq(projects.userId, ctx.user.id), eq(projects.isActive, true))).limit(1)
        return project.length > 0 ? project[0] : null
    }),
    create: protectedProcedure
        .input(NewProjectSchema)
        .mutation(async ({ input, ctx }) => {
            // poner el active a false de todos
            await db.update(projects).set({
                isActive: false
            }).where(eq(projects.userId, ctx.user.id));

            const project = await db.insert(projects).values({
                title: input.title,
                userId: ctx.user.id
            }).returning();

            if (project.length === 0) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
            }

            // save the snapshot json file
            const dataFilePath = path.join(process.cwd(), `data/${project[0].id}.json`);
            try {
                await fs.mkdir('data', { recursive: true });
                await fs.writeFile(dataFilePath, input.snapshot);
            } catch (error) {
                console.error(error)
                await db.delete(projects).where(eq(projects.id, project[0].id));
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
            }

            return project[0];
        }),
    update: protectedProcedure
        .input(UpdateProjectSchema)
        .mutation(async ({ input, ctx }) => {
            return await db.update(projects).set({
                title: input.title,
                isPublic: input.isPublic,
            }).where(and(eq(projects.userId, ctx.user.id), eq(projects.id, input.id)));
        }),
    updateSnapshot: protectedProcedure
        .input(UpdateSnapshotSchema)
        .mutation(async ({ input, ctx }) => {
            // check if project exists and belongs to the user
            const project = await db.select().from(projects).where(eq(projects.id, input.id)).limit(1);
            if (project.length === 0) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }
            if (project[0].userId !== ctx.user.id) {
                throw new TRPCError({ code: 'UNAUTHORIZED' });
            }

            // update the snapshot file
            const dataFilePath = path.join(process.cwd(), `data/${input.id}.json`);
            try {
                await fs.writeFile(dataFilePath, input.snapshot);
            } catch (error) {
                console.error(error)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
            }

            return await db.update(projects).set({
                updatedAt: new Date(),
            }).where(and(eq(projects.userId, ctx.user.id), eq(projects.id, input.id)));
        })
});