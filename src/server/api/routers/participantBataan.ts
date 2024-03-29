import { number, string, z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  Gender,
  Municipality,
  ShirtSize,
  Prisma,
  Participant,
} from "@prisma/client";

export const participantSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  gender: z.nativeEnum(Gender),
  birthdate: z.date(),
  email: z.string().optional(),
  contactNumber: z.string(),
  municipality: z.nativeEnum(Municipality).optional(),
  address: z.string(),
  distance: z.number(),
  shirtSize: z.nativeEnum(ShirtSize),
  emergencyContact: z.string(),
  emergencyContactNumber: z.string(),
  eventId: z.string(),
});

export const participantRouter = createTRPCRouter({
  register: publicProcedure
    .input(participantSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const { distance, firstName, lastName, emergencyContact, ...excess } =
        input;

      try {
        const data = await prisma.participant.findMany({
          where: {
            eventId: excess.eventId,
          },

          orderBy: {
            registrationNumber: "desc",
          },

          take: 1,
        });

        const distancesF = {
          eventId: excess.eventId,
          distance: distance,
          registrationNumber: data[0]?.registrationNumber
            ? data[0]?.registrationNumber + 1
            : 50,
        };

        return await prisma.participant.create({
          data: {
            ...excess,
            firstName: firstName.trim().toLocaleUpperCase(),
            lastName: lastName.trim().toLocaleUpperCase(),
            emergencyContact: emergencyContact.trim().toLocaleUpperCase(),
            registrationNumber: data[0]?.registrationNumber
              ? data[0]?.registrationNumber + 1
              : 27,
            kilometers: {
              create: [distancesF],
            },
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
          }
        }
        throw e;
      }
    }),
  findById: publicProcedure
    .input(z.object({ id: z.string(), eventId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.prisma.participant.findFirst({
        where: {
          id: input.id,
          eventId: input.eventId,
        },
        include: {
          kilometers: true,
          // event: true,
        },
      });

      // if (data?.kilometers[0]?.timeFinished) {
      //   const distance = data?.kilometers[0].distance;
      //   const time = data?.kilometers[0].timeFinished;

      //   if (distance === 3) {
      //     return {
      //       ...data,
      //       time: getFinishedTime(time, data.event.timeStart3km as Date),
      //     };
      //   } else if (distance === 5) {
      //     return {
      //       ...data,
      //       time: getFinishedTime(time, data.event.timeStart5km as Date),
      //     };
      //   } else if (distance === 10) {
      //     return {
      //       ...data,
      //       time: getFinishedTime(time, data.event.timeStart5km as Date),
      //     };
      //   }
      // }

      return data;
    }),
  findByDetails: publicProcedure
    .input(
      z.object({
        registrationNumber: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        // birthdate: z.date(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // const { registrationNumber, firstName, lastName, birthdate, eventId } =
      //   input;

      const { registrationNumber, firstName, lastName, eventId } = input;

      const data = await ctx.prisma.participant.findFirst({
        where: {
          eventId: eventId,
          firstName: firstName,
          lastName: lastName,
          registrationNumber: registrationNumber,
        },
        include: {
          kilometers: true,
          event: true,
        },
      });

      // if (data?.kilometers[0]?.timeFinished) {
      //   const distance = data?.kilometers[0].distance;
      //   const time = data?.kilometers[0].timeFinished;

      //   if (distance === 3) {
      //     return {
      //       ...data,
      //       time: getFinishedTime(time, data.event.timeStart3km as Date),
      //     };
      //   } else if (distance === 5) {
      //     return {
      //       ...data,
      //       time: getFinishedTime(time, data.event.timeStart5km as Date),
      //     };
      //   } else if (distance === 10) {
      //     return {
      //       ...data,
      //       time: getFinishedTime(time, data.event.timeStart5km as Date),
      //     };
      //   }
      // }

      return data;
    }),
  check: publicProcedure
    .input(
      z.object({
        kilometerId: z.string(),
        timeFinished: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { kilometerId, timeFinished } = input;

      await prisma.$transaction(async (tx) => {
        const data = await tx.kilometer.findFirst({
          where: {
            id: kilometerId,
          },
        });

        if (data?.timeFinished) {
          throw new Error("This participant already has a record");
        }

        return await tx.kilometer.update({
          where: {
            id: kilometerId,
          },
          data: {
            timeFinished: timeFinished,
          },
        });
      });
    }),

  manualCheck: publicProcedure
    .input(
      z.object({
        registrationNumber: number(),
        eventId: string(),
        distance: z.number(),
        timeFinished: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { timeFinished, ...excess } = input;
      // throw new Error("This participant already has a record");

      await prisma.$transaction(async (tx) => {
        const data = await tx.kilometer.findFirst({
          where: excess,
        });

        if (data?.timeFinished) {
          throw new Error("This participant already has a record");
        }

        return await tx.kilometer.update({
          where: {
            id: data?.id,
          },
          data: {
            timeFinished: timeFinished,
          },
        });
      });
    }),
  getAll: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        registrationNumber: z.number().optional(),
        take: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.participant.findMany({
        where: {
          eventId: input.eventId,
          registrationNumber: input.registrationNumber,
        },
        orderBy: {
          registrationNumber: "asc",
        },
        include: {
          _count: true,
          event: true,
          kilometers: true,
        },
        take: input.take,
      });
    }),
  getFinisher: publicProcedure
    .input(
      z.object({
        distance: z.number(),
        eventId: z.string(),
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { distance, eventId, limit, cursor, skip } = input;

      const [finishers, finishersCount] = await ctx.prisma.$transaction([
        ctx.prisma.kilometer.findMany({
          where: {
            eventId: eventId,
            distance: distance,
            NOT: {
              timeFinished: null,
            },
          },
          include: {
            participant: {
              select: {
                firstName: true,
                lastName: true,
                registrationNumber: true,
              },
            },
          },
          orderBy: {
            timeFinished: "asc",
          },
          take: limit + 1,

          cursor: cursor ? { id: cursor } : undefined,
        }),
        ctx.prisma.kilometer.count({
          where: {
            eventId: eventId,
            distance: distance,
            NOT: {
              timeFinished: null,
            },
          },
        }),
      ]);

      let nextCursor: typeof cursor | undefined = undefined;
      if (finishers.length > limit) {
        const nextItem = finishers.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      return {
        finishers,
        finishersCount,
        nextCursor,
      };
    }),
  editName: publicProcedure
    .input(
      z.object({
        participantId: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { participantId, ...data } = input;

      const { prisma } = ctx;

      await prisma.participant.update({
        where: {
          id: participantId,
        },
        data: data,
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        participantId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        shirtSize: z.nativeEnum(ShirtSize),
        kilometerId: z.string(),
        distance: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        firstName,
        lastName,
        shirtSize,
        kilometerId,
        distance,
        participantId,
      } = input;
      const { prisma } = ctx;

      return await prisma.$transaction(async (tx) => {
        if (distance) {
          await tx.kilometer.update({
            where: {
              id: kilometerId,
            },
            data: {
              distance: distance,
            },
          });
        }

        return await tx.participant.update({
          where: {
            id: participantId,
          },
          data: {
            firstName,
            lastName,
            shirtSize,
          },
        });
      });
    }),
});
