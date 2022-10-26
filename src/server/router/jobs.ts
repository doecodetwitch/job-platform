import { createRouter } from "./context";
import { resolve } from "path";

export const jobsRouter = createRouter().query("getAllJobs", {
    async resolve({ctx}){
        const jobs = ctx.prisma.job.findMany();
        return jobs;
    }
});