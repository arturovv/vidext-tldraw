import { auth } from "@/auth";
import db from "@/db"
import { projects } from "@/db/schema/projects";
import { asc, eq } from "drizzle-orm";

// DAL for projects

export const getProjectById = async (projectId: string) => {
    const project = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
    return project.length > 0 ? project[0] : null
}

export const setProjectActive = async (projectId: string) => {
    const session = await auth()
    if (!session?.user?.id) {
        return false
    }

    // comprobar que el projecto pertenece al user
    const project = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
    if (project.length === 0) {
        return false
    }
    if (project[0].userId !== session.user.id) {
        return false
    }

    // poner el active a false de todos
    await db.update(projects).set({
        isActive: false
    }).where(eq(projects.userId, session.user.id));

    // poner el active a true del projectId
    await db.update(projects).set({
        isActive: true
    }).where(eq(projects.id, projectId));

    return true
}

export const getUserProjects = async () => {
    const session = await auth()
    if (!session?.user?.id) {
        return []
    }
    return await db.select().from(projects).where(eq(projects.userId, session.user.id)).orderBy(asc(projects.updatedAt))
}