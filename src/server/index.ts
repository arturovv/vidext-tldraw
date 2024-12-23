import { projectsRouter } from "./routers/projects";
import { router } from "./trpc";

export const appRouter = router({
    projects: projectsRouter
});

export type AppRouter = typeof appRouter;