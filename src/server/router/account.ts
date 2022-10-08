import { createProtectedRouter } from "./context";
import z from 'zod';
import { resolve } from "path";

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

      return user;
    },
  }).mutation("addPet", {
    input: z.object({
        name: z.string().min(1),
        type: z.string().min(3),
        breed: z.string().min(3),
        bio: z.string().min(20),
        born_at: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      const pet = await ctx.prisma.pet.create({
        data: {
            name: input.name,
            type: input.type,
            breed: input.breed,
            bio: input.bio,
            born_at: input.born_at,
            userId: ctx.session.user.id
        }
      });

      return pet;
    },
  }).query("getMyPets", {
    async resolve({ctx}){
        const pets = await ctx.prisma.pet.findMany({
            where: {
                userId: ctx.session.user.id
            }
        });

        return pets;
    }
  });
