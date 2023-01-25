import { type NextPage } from "next";
import React, { useState, useRef } from "react";
import ParticipantForm from "../../../components/ParticipantForm";
import { useRouter } from "next/router";

import { api } from "../../../utils/api";
import { Kilometer, Participant, ShirtSize } from "@prisma/client";
import Title from "../../../components/Title";

import { AiOutlineEdit, AiOutlineClose } from "react-icons/ai";
import { CgDanger } from "react-icons/cg";
import { RiLoader5Fill } from "react-icons/ri";
import { useForm, type SubmitHandler } from "react-hook-form";
import { distances } from "../../../utils/constant";
import Image from "next/image";

type EditForm = {
  firstName: string;
  lastName: string;
  distances: number[];
  shirtSize: ShirtSize;
};

const Participant: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const {
    data: eventData,
    isLoading,
    refetch,
  } = api.event.details.useQuery(
    {
      eventId: eventId as string,
      includeKM: true,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const { mutate, isLoading: isUpdating } = api.participant.update.useMutation({
    onSuccess(data) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      findById({ eventId: data.eventId, id: data.id });
    },
  });

  const { mutate: findById, isLoading: isRefetching } =
    api.participant.findById.useMutation({
      onSuccess(data) {
        setEdit(false);
        setParticipant(data);
      },
    });

  const [participant, setParticipant] = useState<
    (Participant & { kilometers: Kilometer[] }) | null
  >();

  const [edit, setEdit] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [errorOptions, setErrorOptions] = useState("");
  const firstCheckbox = useRef<HTMLInputElement>(null);

  const handleParticipant = (
    participant: Participant & { kilometers: Kilometer[] }
  ) => {
    setParticipant(participant);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    if (event.target.checked) {
      // setSelectedOptions([...selectedOptions, parseInt(value)]);
      setSelectedOptions([parseInt(value)]);
    } else {
      setSelectedOptions(
        selectedOptions.filter((option) => option !== parseInt(value))
      );
    }
  };

  const { register, handleSubmit, watch, reset } = useForm<EditForm>();

  const onSubmit: SubmitHandler<EditForm> = (data) => {
    if (selectedOptions.length === 0) {
      setErrorOptions("Pick atleast one option");
      if (firstCheckbox && firstCheckbox.current) firstCheckbox.current.focus();
      return;
    }

    if (data && participant?.kilometers && participant.kilometers[0]) {
      mutate({
        firstName: data.firstName.toUpperCase().trim(),
        lastName: data.lastName.toUpperCase().trim(),
        shirtSize: data.shirtSize,
        participantId: participant.id,
        kilometerId: participant.kilometers[0].id,
        distance: selectedOptions[0] as number,
      });
    }
  };

  if (isLoading) {
    return <></>;
  }

  if (!eventData) {
    return (
      <div className="mx-auto pt-20">
        <p className="text-3xl">Event not found!</p>
      </div>
    );
  }

  if (!participant) {
    return (
      <ParticipantForm
        eventId={eventData.id}
        handleParticipant={handleParticipant}
      />
    );
  }

  return (
    <div className="px-4 pt-6 pb-24">
      <Title value={`PARTICIPANT INFORMATION`} />

      <div className="mt-6 rounded border border-slate-400 bg-slate-100 px-4 py-3 text-slate-700">
        <div className="mb-6 flex items-center justify-center">
          <h2 className="text-2xl font-medium">
            Registration No.{" "}
            <span className="font-semibold">
              {participant.registrationNumber}
            </span>
          </h2>

          {!edit && (
            <button
              onClick={() => {
                setEdit(true);
              }}
              className="ml-auto mr-4 flex cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-stone-600 py-1 px-2 font-semibold hover:bg-slate-200"
            >
              EDIT <AiOutlineEdit className="text-2xl" />
            </button>
          )}

          {edit && (
            <button
              onClick={() => {
                setEdit(false);
              }}
              className="ml-auto mr-4 flex cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-red-400  bg-red-100 py-1 px-2 font-semibold text-red-700 transition-all hover:bg-red-200"
            >
              EDIT <AiOutlineClose className="text-2xl text-red-700" />
            </button>
          )}
        </div>

        {!edit && (
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1 flex flex-col gap-2">
              <div>
                <p className="font-semibold">First Name</p>
                <p>{participant.lastName}</p>
              </div>
              <div>
                <p className="font-semibold">Last Name</p>
                <p>{participant.firstName}</p>
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              <div>
                <p className="font-semibold">Shirt Size</p>
                <p>{participant.shirtSize}</p>
              </div>
              <div>
                <p className="font-semibold">Distance</p>
                {participant.kilometers.map(({ id, distance }) => (
                  <p key={id}>{distance} KM</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {edit && (
          /* eslint-disable @typescript-eslint/no-misused-promises */
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-2"
          >
            <div className="col-span-1 flex flex-col gap-2">
              <div>
                <label htmlFor="firstName" className="block font-semibold">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  defaultValue={participant.firstName}
                  {...register("firstName")}
                  className="w-full uppercase sm:w-10/12"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block font-semibold">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  defaultValue={participant.lastName}
                  {...register("lastName")}
                  className="w-full uppercase sm:w-10/12"
                />
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              <div>
                <label htmlFor="shirtSize" className="block font-semibold">
                  Shirt Size
                </label>
                <select
                  id="shirtSize"
                  required
                  {...register("shirtSize")}
                  defaultValue={participant.shirtSize}
                  className="w-full uppercase sm:w-10/12"
                >
                  <option value={""}>Choose...</option>
                  {Object.keys(ShirtSize).map((shirtSize) => (
                    <option key={shirtSize} value={shirtSize}>
                      {shirtSize}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-2 font-semibold">Kilometer</p>
                <div className="flex flex-wrap gap-4">
                  {distances.map((option) => {
                    return (
                      <div className="flex items-center" key={option.value}>
                        <input
                          id={option.label}
                          type="checkbox"
                          value={option.value}
                          ref={firstCheckbox}
                          checked={selectedOptions.some(
                            (selectedOption) => selectedOption === option.value
                          )}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor={option.label}
                          className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500"
                        >
                          {option.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {!isUpdating && !isRefetching && (
              <button
                type="submit"
                className={`col-span-2 rounded-md border-2 bg-[#0062ad] p-2 text-white hover:bg-[#0d6cb5]`}
              >
                SAVE
              </button>
            )}
            {(isUpdating || isRefetching) && (
              <button
                disabled
                type="submit"
                className={`col-span-2 flex justify-center rounded-md border-2 bg-[#0062ad] p-2 text-white hover:bg-[#0d6cb5] disabled:opacity-60`}
              >
                <RiLoader5Fill className="animate-spin text-center text-2xl" />
              </button>
            )}
          </form>
        )}
      </div>
      {edit && (
        <div className="mt-4 rounded-sm border-2 border-red-400  bg-red-100 py-1 px-2 text-red-700 transition-all">
          <h3 className="mb-1 flex items-center gap-1 text-2xl font-medium">
            NOTICE REMINDER <CgDanger />{" "}
          </h3>
          <p>
            Please be reminded that the option to edit your shirt size and
            distance on our website is available for a limited time only. We
            recommend that you update your preferences as soon as possible to
            ensure that your choices is processed correctly.
          </p>
        </div>
      )}

      <div className="relative mt-6 h-[700px] w-[1000px] lg:block">
        <Image
          src={"/cerfifates/hermosa.jpg"}
          width={800}
          height={1000}
          alt="hermosa certificate"
          className="absolute inset-40 left-0 top-5"
        ></Image>
        <div className="absolute inset-60 top-[245px] left-[350px] right-[280px] z-10 flex justify-center text-2xl ">
          <p className="text-[24px] font-semibold">
            {participant.firstName} {participant.lastName}
          </p>
        </div>
        <div className="absolute top-[294px] right-[435px] left-[500px] flex justify-center">
          <p className="text-[19px] font-bold">5 KM</p>
        </div>
        <div className="absolute top-[373px] right-[350px] left-[562px]">
          <p className="text[14px] font-medium">00:00:00</p>
        </div>
      </div>

      <div className="relative mt-6 hidden h-[500px] w-[750px] md:block lg:hidden">
        <Image
          src={"/cerfifates/hermosa.jpg"}
          width={600}
          height={750}
          alt="hermosa certificate"
          className="absolute inset-40 left-0 top-5"
        ></Image>
        <div className="absolute inset-60 top-[185px] left-[260px] right-[205px] z-10 flex justify-center text-xl">
          <p className="text-[20px] font-semibold ">JOHN CARLO ASILO</p>
        </div>
        <div className="absolute top-[223px] right-[325px] left-[375px] flex justify-center">
          <p className="text-[15px] font-bold">5 KM</p>
        </div>
        <div className="absolute top-[286px] right-[250px] left-[420px]">
          <p className="text-[10px] font-medium">00 : 00 : 00</p>
        </div>
      </div>

      <div className="relative mt-6 hidden h-[500px] w-[750px] md:block lg:hidden">
        <Image
          src={"/cerfifates/hermosa.jpg"}
          width={600}
          height={750}
          alt="hermosa certificate"
          className="absolute inset-40 left-0 top-5"
        ></Image>
        <div className="absolute inset-60 top-[185px] left-[260px] right-[205px] z-10 flex justify-center text-xl">
          <p className="text-[20px] font-semibold ">JOHN CARLO ASILO</p>
        </div>
        <div className="absolute top-[223px] right-[325px] left-[375px] flex justify-center">
          <p className="text-[15px] font-bold">5 KM</p>
        </div>
        <div className="absolute top-[286px] right-[250px] left-[420px]">
          <p className="text-[10px] font-medium">00 : 00 : 00</p>
        </div>
      </div>
    </div>
  );
};

export default Participant;
