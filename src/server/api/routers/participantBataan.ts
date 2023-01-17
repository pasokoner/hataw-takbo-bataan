import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  AgeGroup,
  Gender,
  Kilometer,
  Municipality,
  ShirtSize,
} from "@prisma/client";

export const participantSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  ageGroup: z.nativeEnum(AgeGroup),
  gender: z.nativeEnum(Gender),
  birthdate: z.date(),
  email: z.string().optional(),
  contactNumber: z.string(),
  municipality: z.nativeEnum(Municipality).optional(),
  address: z.string(),
  kilometer: z.nativeEnum(Kilometer),
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

      const data = await prisma.participant.create({
        data: input,
      });

      return data;
    }),
});
