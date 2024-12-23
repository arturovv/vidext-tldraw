import {
    boolean,
    timestamp,
    pgTable,
    text,
    unique,
} from "drizzle-orm/pg-core"
import { users } from "./auth"
import * as zod from "zod";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const projects = pgTable(
    "project",
    {
        id: text()
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        userId: text()
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        title: text().notNull(),
        isPublic: boolean().notNull().default(false),
        isActive: boolean().notNull().default(true),
        createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
    },
    (projectTable) => [{
        unq: unique().on(projectTable.userId, projectTable.isActive),
    }])

export const ProjectSchema = createSelectSchema(projects);
export const NewProjectSchema = createInsertSchema(projects).pick({
    title: true,
}).extend({
    snapshot: zod.string()
});

export const UpdateProjectSchema = createUpdateSchema(projects).pick({
    title: true,
    isPublic: true,
    isActive: true
}).extend({
    id: zod.string(),
});

export const UpdateSnapshotSchema = zod.object({
    id: zod.string(),
    snapshot: zod.string()
})

export const GetSnapshotSchema = zod.object({
    id: zod.string()
})


export type TProject = zod.infer<typeof ProjectSchema>;
export type TNewProject = zod.infer<typeof NewProjectSchema>;
export type TUpdateProject = zod.infer<typeof UpdateProjectSchema>;