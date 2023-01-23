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

      await prisma.$transaction(async (tx) => {
        try {
          const data = await tx.participant.findMany({
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

          return await tx.participant.create({
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
      });
    }),
  findById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.participant.findFirst({
        where: {
          id: input.id,
        },
      });
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
});
