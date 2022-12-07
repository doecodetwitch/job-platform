import { createRouter } from "./context";
import z from "zod";

export const petsRouter = createRouter().query("getAllPets", {
    async resolve({ctx}){
        const pets = ctx.prisma.pet.findMany();
        return pets;
    }
}).query("getPetTypes", {
    async resolve({ctx}){
        const petTypes = ctx.prisma.petType.findMany();
        return petTypes;
    }
}).query("getPetById", {
    input: z.object({
        id: z.string()
    }),
    async resolve({ctx, input}){
        const pet = ctx.prisma.petType.findUnique({
            where: {
                id: input.id,
            }
        });

        return pet;
    }
});