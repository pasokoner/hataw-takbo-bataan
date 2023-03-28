import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  fullDetails: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { eventId } = input;

      return await prisma.event.findFirst({
        where: {
          id: eventId,
        },
        include: {
          kilometer: {
            include: {
              participant: true,
            },
          },
        },
      });
    }),
  details: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { eventId } = input;

      return await prisma.event.findFirst({
        where: {
          id: eventId,
        },
      });
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
  getBreakdown: publicProcedure
    .input(
      z.object({
        finishers: z.boolean(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      const events = await prisma.event.findMany({
        where: {
          NOT: {
            id: "clde678wm0004f1k4bofoulll",
          },
        },

        include: {
          kilometer: true,
        },
      });

      return events.map(({ name, kilometer }) => {
        const three = kilometer.filter(({ timeFinished, distance }) =>
          input.finishers ? !timeFinished && distance === 3 : distance === 3
        );
        const five = kilometer.filter(({ timeFinished, distance }) =>
          input.finishers ? !timeFinished && distance === 5 : distance === 5
        );
        const ten = kilometer.filter(({ timeFinished, distance }) =>
          input.finishers ? !timeFinished && distance === 10 : distance === 10
        );

        return {
          name,
          three: three.length,
          five: five.length,
          ten: ten.length,
        };
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
