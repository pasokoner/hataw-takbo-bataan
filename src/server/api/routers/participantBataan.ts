import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  AgeGroup,
  Gender,
  Municipality,
  ShirtSize,
  Prisma,
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

      const {
        distances,
        firstName,
        lastName,
        emergencyContact,
        ...removeDistances
      } = input;

      const distancesF = distances.map((distance) => {
        return {
          eventId: removeDistances.eventId,
          distance: distance,
        };
      });

      try {
        const data = await prisma.participant.create({
          data: {
            ...removeDistances,
            firstName: firstName.trim().toLocaleUpperCase(),
            lastName: lastName.trim().toLocaleUpperCase(),
            emergencyContact: emergencyContact.trim().toLocaleUpperCase(),
            kilometers: {
              create: [...distancesF],
            },
          },
        });

        return data;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
            console.log(
              "There is a unique constraint violation, a new user cannot be created with this email"
            );
          }
        }
        throw e;
      }

      // WHY THE FCK DID I DO THIS?
      // await prisma.$transaction(async (tx) => {
      //   const participant = await tx.participant.create({
      //     data: removeDistances,
      //   });

      //   const { id, eventId } = participant;

      //   if (id && eventId) {
      //     const distancesF = distances.map((distance) => {
      //       return {
      //         participantId: id,
      //         eventId: eventId,
      //         distance: distance,
      //       };
      //     });

      //     await tx.kilometer.createMany({
      //       data: distancesF,
      //     });
      //   }

      //   throw new Error(
      //     "It seems like there is an error - Registration failed!"
      //   );
      // });
    }),
});