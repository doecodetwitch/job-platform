import { createProtectedRouter } from "./context";
import z from 'zod';
import { resolve } from "path";
import S3 from 'aws-sdk/clients/s3';
import { TRPCError } from '@trpc/server';

const s3 = new S3({
  region: 'eu-central-1',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  signatureVersion: 'v4'
});

const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb'
    }
  }
}

// Example router with queries that can only be hit if the user requesting is signed in
export const accountRouter = createProtectedRouter()
  .mutation("updateName", {
    input: z.object({
      name: z.string().min(1),
      image: z.string()
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          image: input.image
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
      image: z.string(),
    }),
    async resolve({ ctx, input }) {
      const pet = await ctx.prisma.pet.create({
        data: {
          name: input.name,
          type: input.type,
          breed: input.breed,
          bio: input.bio,
          born_at: input.born_at,
          userId: ctx.session.user.id,
          image: input.image
        }
      });

      return pet;
    },
  }).query("getMyPets", {
    async resolve({ ctx }) {
      const pets = await ctx.prisma.pet.findMany({
        where: {
          userId: ctx.session.user.id
        }
      });

      return pets;
    }
  }).mutation("getS3UrlPromise", { //a link on which the user can upload an image
    input: z.object({
      name: z.string(),
      type: z.string(),
    }),
    async resolve({ input }) {
      const fileParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: input.name,
        Expires: 600,
        ContentType: input.type
      };

      const url = await s3.getSignedUrlPromise('putObject', fileParams)

      return url;
    }
  }).mutation("postJob", {
    input: z.object({
      petId: z.string(),
      title: z.string(),
      description: z.string(),
      price: z.number(),
      contactEmail: z.string(),
      contactNumber: z.string(),
    }),
    async resolve({ ctx, input }) {
      const job = await ctx.prisma.job.create({
        data: {
          petId: input.petId,
          userId: ctx.session.user.id,
          title: input.title,
          description: input.description,
          price: input.price,
          contactEmail: input.contactEmail,
          contactNumber: input.contactNumber,
          status: 'active'
        }
      });

      return job;
    },
  }).mutation("editJob", {
    input: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      price: z.number(),
      contactEmail: z.string(),
      contactNumber: z.string(),
      status: z.string()
    }),
    async resolve({ ctx, input }) {
      ctx.prisma.job.findUnique({
        where: {
          id: input.id
        }
      }).then(async (data)=>{
        if (data?.userId === ctx.session.user.id) {
          const job = await ctx.prisma.job.update({
            where: {
              id: input.id,
            },
            data: {
              title: input.title,
              description: input.description,
              price: input.price,
              contactEmail: input.contactEmail,
              contactNumber: input.contactNumber,
              status: input.status
            }
          });

          return job;
        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'The user is not authorized to modify this job.',
          });
        }
      }).catch(() => {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'This job does not exist.',
          });
      });
    },
  }).mutation("deleteJob", {
      input: z.object({
        id: z.string(),
      }),
      async resolve({ ctx, input }) {
        ctx.prisma.job.findUnique({
          where: {
            id: input.id
          }
        }).then(async (data)=>{
          if (data?.userId === ctx.session.user.id) {
            const job = await ctx.prisma.job.delete({
              where: {
                id: input.id,
              }
            });

            return job;
          } else {
            throw new TRPCError({
              code: 'UNAUTHORIZED',
              message: 'The user is not authorized to modify this job.',
            });
          }
        }).catch(() => {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'This job does not exist.',
          });
        });
      },
    }).query("getMyJobs", {
    async resolve({ ctx }) {
      const jobs = await ctx.prisma.job.findMany({
        where: {
          userId: ctx.session.user.id
        }
      });

      return jobs;
    }
  });
