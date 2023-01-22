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
});
