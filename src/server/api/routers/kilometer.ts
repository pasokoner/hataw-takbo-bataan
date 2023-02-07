import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const kilometerRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.kilometer.findMany({
        where: {
          eventId: input.eventId,
        },
        orderBy: {
          registrationNumber: "asc",
        },
      });
    }),
  getFinishers: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        distance: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { eventId, distance } = input;

      return await ctx.prisma.kilometer.findMany({
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
      });
    }),
});
