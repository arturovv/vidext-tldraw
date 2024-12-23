import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

const trpc = initTRPC.context<Context>().create();

export const router = trpc.router;
export const publicProcedure = trpc.procedure;

export const protectedProcedure = trpc.procedure.use(
    async function isAuthed(opts) {
        const { ctx } = opts;
        // `ctx.user` is nullable
        if (!ctx.user) {
            //     ^?
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        return opts.next({
            ctx: {
                // ✅ user value is known to be non-null now
                user: ctx.user,
            },
        });
    },
);
