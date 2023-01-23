import {
  PrismaClient,
  type ShirtSize,
  type Gender,
  type Municipality,
} from "@prisma/client";

import data from "./hermosa.json";

const prisma = new PrismaClient();

type DataImport = {
  firstName: string;
  lastName: string;
  birthdate?: string;
  email?: string;
  gender: Gender;
  contactNumber: number;
  address?: string | number;
  municipality?: Municipality;
  distances: number[];
  registrationNumber: number;
  shirtSize: ShirtSize;
  registrationDate: string;
  emergencyContact?: string | number;
  emergencyContactNumber?: number;
  eventId: string;
};

type FormattedData = {
  firstName: string;
  lastName: string;
  birthdate?: Date;
  email?: string;
  gender: Gender;
  contactNumber: string;
  address?: string;
  municipality?: Municipality;
  kilometers: {
    eventId: string;
    distance: number;
    registrationNumber: number;
  }[];
  registrationNumber: number;
  shirtSize: ShirtSize;
  registrationDate: Date;
  emergencyContact?: string;
  emergencyContactNumber?: string;
  eventId: string;
};

const main = async () => {
  try {
    await prisma.kilometer.deleteMany();
    await prisma.participant.deleteMany();

    const participants = data as DataImport[];

    // const findDuplicate = (participant: DataImport) => {
    //   return participants.filter((p) => {
    //     return (
    //       p.firstName === participant.firstName &&
    //       p.lastName === participant.lastName &&
    //       p.birthdate === participant.birthdate
    //     );
    //   });
    // };

    for (let i = 0; i < participants.length; i++) {
      const data = participants[i];
      if (data) {
        const { distances, ...participant } = data;
        const eventId = participant.eventId;
        const registrationDate = new Date(participant.registrationDate);
        const birthdate = participant.birthdate
          ? new Date(participant.birthdate)
          : undefined;
        const contactNumber = !participant.contactNumber
          ? ""
          : typeof participant.contactNumber === "number"
          ? "0" + participant.contactNumber.toString()
          : participant.contactNumber;
        const address = !participant.address
          ? undefined
          : typeof participant.address === "number"
          ? participant.address.toString()
          : participant.address;
        const emergencyContact = !participant.emergencyContact
          ? undefined
          : typeof participant.emergencyContact === "number"
          ? "0" + participant.emergencyContact.toString()
          : participant.emergencyContact;

        const emergencyContactNumber = !participant.emergencyContactNumber
          ? undefined
          : typeof participant.emergencyContactNumber === "number"
          ? "0" + participant.emergencyContactNumber.toString()
          : participant.emergencyContactNumber;

        const distancesF = distances.map((distance) => {
          return {
            eventId: eventId,
            distance: distance,
            registrationNumber: participant.registrationNumber,
          };
        });

        const firstName = `$}{participant.firstName}`;
        const lastName = `$}{participant.flastName}`;

        await prisma.participant.create({
          data: {
            ...participant,
            address: address,
            eventId,
            registrationDate,
            birthdate,
            contactNumber,
            emergencyContact,
            emergencyContactNumber,
            firstName,
            lastName,
            kilometers: {
              create: distancesF,
            },
          },
        });
      }
    }
  } catch (error) {
    throw error;
  }
};

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
