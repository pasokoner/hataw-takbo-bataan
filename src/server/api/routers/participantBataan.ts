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
  distances: z.array(z.number()),
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

      const { distances, firstName, lastName, emergencyContact, ...excess } =
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

        const distancesF = distances.map((distance) => {
          return {
            eventId: excess.eventId,
            distance: distance,
            registrationNumber: data[0]?.registrationNumber
              ? data[0]?.registrationNumber + 1
              : 27,
          };
        });

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
              create: [...distancesF],
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
        },
      });

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
          // birthdate: birthdate,
        },
        include: {
          kilometers: true,
        },
      });

      return data;
    }),
  check: publicProcedure
    .input(
      z.object({
        kilometerId: string(),
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
        },
        take: input.take,
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
