import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  name: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { eventId } = input;

      const data = await prisma.event.findFirst({
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

      return data;
    }),
  // getAll: publicProcedure.query(async ({ ctx }) => {
  //   const { prisma } = ctx;

  //   return;
  // }),
});
