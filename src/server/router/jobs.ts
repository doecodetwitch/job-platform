import { createRouter } from "./context";

export const jobsRouter = createRouter().query("getAllJobs", {
    async resolve({ctx}){
        const jobs = ctx.prisma.job.findMany({
            where: {
                status: 'active'
            }
        });
        return jobs;
    }
});