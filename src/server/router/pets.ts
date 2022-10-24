import { createRouter } from "./context";
import { resolve } from "path";

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
});