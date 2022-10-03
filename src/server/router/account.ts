import { createProtectedRouter } from "./context";
import z from 'zod';

// Example router with queries that can only be hit if the user requesting is signed in
export const accountRouter = createProtectedRouter()
  .mutation("updateName", {
    input: z.object({
        name: z.string().min(1)
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.update({
        where: {
            id: ctx.session.user.id,
        }, 
        data: {
            name: input.name,
        },
      })

      return user
    },
  });
