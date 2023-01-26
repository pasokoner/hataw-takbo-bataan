import React from "react";
import { AiOutlineQrcode } from "react-icons/ai";
import { TbUserSearch, TbSearch } from "react-icons/tb";

import { useForm, type SubmitHandler } from "react-hook-form";

import { Html5Qrcode } from "html5-qrcode";

import { api } from "../utils/api";

import dayjs from "dayjs";
import type { Participant, Kilometer } from "@prisma/client";

type ParticipantForm = {
  firstName: string;
  lastName: string;
  birthdate: string;
  registrationNumber: string;
};

type Props = {
  eventId: string;
  handleParticipant: (
    participant: Participant & { kilometers: Kilometer[] }
  ) => void;
};

const ParticipantForm = ({ eventId, handleParticipant }: Props) => {
  const { mutate: findById, isLoading: idLoading } =
    api.participant.findById.useMutation({
      onSuccess: (data) => {
        if (data) {
          handleParticipant(data);
        }
      },
    });

  const { mutate: byDetails, isLoading: detailsLoading } =
    api.participant.findByDetails.useMutation({
      onSuccess: (data) => {
        if (data) {
          handleParticipant(data);
        }
      },
    });

  const { register, handleSubmit, watch, reset } = useForm<ParticipantForm>();

  const onSubmit: SubmitHandler<ParticipantForm> = (data) => {
    if (data) {
      const { registrationNumber } = data;

      const birthdate = new Date(data.birthdate);
      const utcDate = new Date(
        birthdate.getUTCFullYear(),
        birthdate.getUTCMonth(),
        birthdate.getUTCDate()
      );

      byDetails({
        ...data,
        registrationNumber: parseInt(registrationNumber),
        firstName: data.firstName.toUpperCase().trim(),
        lastName: data.lastName.toUpperCase().trim(),
        // birthdate: dayjs(data.birthdate).toDate(),
        eventId,
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            const img = new Image();
            img.src = e.target.result as string;

            img.onload = async () => {
              const qrDecode = new Html5Qrcode("dropzone-file");

              const res = await qrDecode.scanFile(file, true);
              if (typeof res === "string") {
                findById({ eventId: eventId, id: res });
              }
            };
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.log("Invalid file type");
      }
    }
  };

  return (
    <div className="flex h-[70vh] w-full flex-col items-center pt-12  md:justify-center">
      <div className="flex w-11/12 max-w-[24rem] flex-col items-center gap-4 rounded-md border-2 border-solid border-black sm:w-96">
        <h2 className="w-full rounded-t-sm bg-primary p-2 text-center font-semibold text-white">
          AUTHENTICATOR
        </h2>
        {/* <div className="flex justify-center">
          <input type="file" className="py-2 px-6" />
        </div> */}
        <div className="flex w-full items-center justify-center">
          <label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-32 w-10/12 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <AiOutlineQrcode className="mb-3 text-4xl text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">QR CODE AUTHENTICATOR</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG or JPG
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*"
            />
          </label>
        </div>
        <div className="rounded-full border-y-2 border-solid p-2">OR?</div>
        {/* eslint-disable @typescript-eslint/no-misused-promises */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center gap-2"
        >
          <div className="col-span-2 flex w-10/12 flex-col gap-2 md:col-span-1">
            <input
              type="text"
              id="registrationNumber"
              placeholder="Registration Number"
              required
              {...register("registrationNumber")}
              className="uppercase"
            />
          </div>
          <div className="col-span-2 flex w-10/12 flex-col gap-2 md:col-span-1">
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              required
              {...register("firstName")}
              className="uppercase"
            />
          </div>
          <div className="col-span-2 flex w-10/12 flex-col gap-2 md:col-span-1">
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              required
              {...register("lastName")}
              className="uppercase"
            />
          </div>
          {/* <div className="col-span-2 mb-4 flex w-10/12 flex-col gap-2 md:col-span-1">
            <input
              type="date"
              id="birthdate"
              pattern="/^[0-9]+$/"
              required
              {...register("birthdate")}
            />
          </div> */}

          {!idLoading && !detailsLoading && (
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 bg-primary py-3 text-white hover:bg-[#0d6cb5] disabled:bg-[#0d6cb5]"
            >
              FIND MY ACCOUNT <TbUserSearch className="inline" />
            </button>
          )}

          {(idLoading || detailsLoading) && (
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 bg-primary py-3 text-white hover:bg-[#0d6cb5] disabled:bg-[#0d6cb5]"
            >
              FIND MY ACCOUNT <TbUserSearch className="inline animate-spin" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ParticipantForm;
