import { createRouter } from "./context";
import z from "zod";

export const jobsRouter = createRouter().query("getAllJobs", {
    async resolve({ctx}){
        const jobs = ctx.prisma.job.findMany({
            where: {
                status: 'active'
            }
        });
        return jobs;
    }
}).query("getJobById", {
    input: z.object({
        id: z.string()
    }),
    async resolve({ctx, input}){
        const job = ctx.prisma.job.findUnique({
            where: {
                id: input.id,
            },
            include: {
                user: true,
                pet: true
            }
        });
        return job;
    }
});