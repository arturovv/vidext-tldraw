import db from "@/db"
import { projects, } from "@/db/schema/projects";
import { eq } from "drizzle-orm";

export const getProjectById = async (projectId: string) => {
    const project = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
    return project.length > 0 ? project[0] : null
}