import { auth } from '@/auth';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';


export const createContext = async (opts: FetchCreateContextFnOptions) => {
    const session = await auth()
    const user = session?.user

    return {
        user,
    };
};
export type Context = Awaited<ReturnType<typeof createContext>>;