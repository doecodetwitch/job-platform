import { createProtectedRouter } from "./context";
import z from 'zod';
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
    .query("getUserDetails", {
      async resolve({ ctx }) {
        const userDetails = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.session.user.id
          },
          include: {
            receivedFriendRequests: true,
            friends: true
          },
        });

        return userDetails;
      }
    }).query("getFriendRequestDetails", {
      input: z.object({
        id: z.string()
      }),
      async resolve({ ctx, input }) {
        const friendRequestDetails = await ctx.prisma.friendRequest.findUnique({
          where: {
            id: input.id
          },
          include: {
            sender: true
          },
        });

        if (friendRequestDetails?.receiverId === ctx.session.user.id) {
            return friendRequestDetails;
        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'The user is not authorized to see this request.',
          });
        }
      }
    }).mutation("acceptFriendRequest", {
      input: z.object({
        id: z.string()
      }),
      async resolve({ ctx, input }) {
        const friendRequest = await ctx.prisma.friendRequest.findUnique({
          where: {
            id: input.id,
          }
        });

        if (friendRequest?.receiverId === ctx.session.user.id) {
          //add sender to the receiver friend list
          await ctx.prisma.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data: {
              friends: {
                connect: {
                  id: friendRequest.senderId
                }
              }
            }
          }),
          //add receiver to the sender friend list
          await ctx.prisma.user.update({
            where: {
              id: friendRequest.senderId,
            },
            data: {
              friends: {
                connect: {
                  id: ctx.session.user.id
                }
              }
            }
          }),
          //when all the previous steps have completed, remove the friend request from the db
          await ctx.prisma.friendRequest.delete({
            where: {
              id: input.id,
            }
          }).then(()=>{
            return 'success';
          }).catch((err) => {
            return err;
          })
        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'The user is not authorized to accept this request.',
          });
        }
      },
    }).mutation("declineFriendRequest", {
      input: z.object({
        id: z.string()
      }),
      async resolve({ ctx, input }) {
        const friendRequest = await ctx.prisma.friendRequest.findUnique({
          where: {
            id: input.id,
          }
        });

        if (friendRequest?.receiverId === ctx.session.user.id) {
          await ctx.prisma.friendRequest.delete({
            where: {
              id: input.id,
            }
          }).then(()=>{
            return 'success';
          })
        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'The user is not authorized to accept this request.',
          });
        }
      },
    }).mutation("updateName", {
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
  }).mutation("removeUserFromFriends", {
      input: z.object({
        id: z.string(),
      }),
      async resolve({ ctx, input }) {
        await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            friends: {
              disconnect: [{id: input.id}]
            }
          }
        }),
        await ctx.prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            friends: {
              disconnect: [{id: ctx.session.user.id}]
            }
          }
        }).catch(err => {
          return err;
        });

        return 'success';
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
  }).mutation("sendFriendRequest", {
      input: z.object({
        senderId: z.string(),
        receiverId: z.string()
      }),
      async resolve({ ctx, input }) {
        if (input?.senderId === ctx.session.user.id) {
          await ctx.prisma.friendRequest.findFirst({
            where: {
              senderId: input.senderId,
              receiverId: input.receiverId
            }
          }).then(async (data) => {
            if (data === null) {
              await ctx.prisma.friendRequest.create({
                data: {
                  senderId: input.senderId,
                  receiverId: input.receiverId
                },
              }).then(()=>{
                return 'success'
              }).catch(() => {
                return 'error'
              });
            } else {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'This friend request has already been sent.',
              });
            }
          }).catch((error) => {
            console.log('error', error)
          });
        } else {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'The user is not authorized to send this friend request.',
          });
        }
      },
    })
    .query("getUserAddress", {
      async resolve({ ctx }) {
        const userAddress = await ctx.prisma.userAddress.findFirst({
          where: {
            userId: ctx.session.user.id
          }
        });
  
        return userAddress;
      }
    })
    .mutation("updateUserAddress", {
      input: z.object({
        country: z.string(),
        city: z.string(),
        street: z.string(),
        houseNumber: z.string(),
        postalCode: z.string()
      }),
      async resolve({ ctx, input }) {
        await ctx.prisma.userAddress.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            country: input.country,
            city: input.city,
            postalCode: input.postalCode,
            street: input.street,
            houseNumber: input.houseNumber
          },
        })
  
        return 'success';
      },
    });
