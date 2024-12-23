import db from "@/db";
import { GetSnapshotSchema, NewProjectSchema, projects, UpdateProjectSchema, UpdateSnapshotSchema } from "@/db/schema/project";
import { and, asc, eq } from "drizzle-orm";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const projectsRouter = router({
    getSnapshotById: protectedProcedure.input(GetSnapshotSchema).query(async ({ input, ctx }) => {
        // check if project exists and it's public
        const project = await db.select().from(projects).where(eq(projects.id, input.id)).limit(1);
        if (project.length === 0) {
            throw new TRPCError({ code: 'NOT_FOUND' });
        }
        if (project[0].userId !== ctx.user.id && !project[0].isPublic) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        // to-do return the snapshot json file
        return null
    }),
    create: protectedProcedure
        .input(NewProjectSchema)
        .mutation(async ({ input, ctx }) => {
            return await db.insert(projects).values({
                title: input.title,
                userId: ctx.user.id
            }).returning();
        }),
    update: protectedProcedure
        .input(UpdateProjectSchema)
        .mutation(async ({ input, ctx }) => {
            return await db.update(projects).set({
                title: input.title,
                isPublic: input.isPublic,
                isActive: input.isActive
            }).where(and(eq(projects.userId, ctx.user.id), eq(projects.id, input.id)));
        }),
    updateSnapshot: protectedProcedure
        .input(UpdateSnapshotSchema)
        .mutation(async ({ input, ctx }) => {
            // to-do update the snapshot

            return await db.update(projects).set({
                updatedAt: new Date(),
            }).where(and(eq(projects.userId, ctx.user.id), eq(projects.id, input.id)));
        })
});