import { createProtectedRouter } from "./context";
import { resolve } from "path";

export const jobsRouter = createProtectedRouter().query("getAllJobs", {
    async resolve({ctx}){
        const jobs = ctx.prisma.job.findMany();
        return jobs;
    }
});