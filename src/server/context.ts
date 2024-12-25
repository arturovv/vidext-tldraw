import { auth } from '@/auth';

export const createContext = async () => {
    const session = await auth()
    const user = session?.user

    return {
        user,
    };
};
export type Context = Awaited<ReturnType<typeof createContext>>;