import { auth } from '@/auth';
import * as trpcNext from '@trpc/server/adapters/next';

export async function createContext({
    req,
    res,
}: trpcNext.CreateNextContextOptions) {
    // Create your context based on the request object
    // Will be available as `ctx` in all your resolvers

    const session = await auth()
    const user = session?.user

    return {
        user,
    };
}
export type Context = Awaited<ReturnType<typeof createContext>>;