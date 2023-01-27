import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  details: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        includeKM: z.boolean(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { eventId, includeKM } = input;

      const data = await prisma.event.findFirst({
        where: {
          id: eventId,
        },
        include: {
          kilometer: {
            include: {
              participant: includeKM,
            },
          },
        },
      });

      return data;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    return prisma.event.findMany({
      orderBy: {
        scheduleTimeStart: "desc",
      },

      include: {
        _count: true,
      },
    });
  }),
  config: publicProcedure
    .input(
      z.object({
        cameraPassword: z.string(),
        eventId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { cameraPassword, eventId } = input;

      return ctx.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          cameraPassword: cameraPassword,
        },
      });
    }),
  start: publicProcedure
    .input(
      z.object({
        kilometer: z.enum(["3", "5", "10"]),
        timeStart: z.date(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { kilometer, timeStart, eventId } = input;

      if (kilometer === "3") {
        await prisma.event.update({
          where: {
            id: eventId,
          },
          data: {
            timeStart3km: timeStart,
          },
        });
      } else if (kilometer === "5") {
        await prisma.event.update({
          where: {
            id: eventId,
          },
          data: {
            timeStart5km: timeStart,
          },
        });
      } else if (kilometer === "10") {
        await prisma.event.update({
          where: {
            id: eventId,
          },
          data: {
            timeStart10km: timeStart,
          },
        });
      }
    }),
  end: publicProcedure
    .input(
      z.object({
        kilometer: z.enum(["3", "5", "10"]),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { kilometer, eventId } = input;

      if (kilometer === "3") {
        await prisma.event.update({
          where: {
            id: eventId,
          },
          data: {
            raceFinished3km: true,
          },
        });
      } else if (kilometer === "5") {
        await prisma.event.update({
          where: {
            id: eventId,
          },
          data: {
            raceFinished5km: true,
          },
        });
      } else if (kilometer === "10") {
        await prisma.event.update({
          where: {
            id: eventId,
          },
          data: {
            raceFinished10km: true,
          },
        });
      }
    }),
});
