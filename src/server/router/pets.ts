import { createProtectedRouter } from "./context";
import { resolve } from "path";

export const petsRouter = createProtectedRouter().query("getAllPets", {
    async resolve({ctx}){
        const pets = ctx.prisma.pet.findMany();
        return pets;
    }
});