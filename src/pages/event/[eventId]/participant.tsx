import { type NextPage } from "next";
import React, { useState, useRef, RefObject } from "react";
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
import html2canvas from "html2canvas";
import { FiDownload } from "react-icons/fi";
import ScreenContainer from "../../../layouts/ScreenContainer";

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
  const [showCertificate, setShowCertificate] = useState(false);
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
        firstName: data.firstName
          ? data.firstName.toUpperCase().trim()
          : participant.firstName,
        lastName: data.lastName
          ? data.lastName.toUpperCase().trim()
          : participant.lastName,
        shirtSize: data.shirtSize ? data.shirtSize : participant.shirtSize,
        participantId: participant.id,
        kilometerId: participant.kilometers[0].id,
        distance: (selectedOptions[0] as number)
          ? selectedOptions[0]
          : participant.kilometers[0].distance,
      });
    }
  };

  const certL = useRef<HTMLDivElement>(null);
  const certMd = useRef<HTMLDivElement>(null);
  const certSm = useRef<HTMLDivElement>(null);
  const certXs = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async (cert: RefObject<HTMLDivElement>) => {
    const element = cert.current;
    const canvas = await html2canvas(element as HTMLDivElement);

    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "hataw-bataan-certificate.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
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
    <ScreenContainer className="mx-auto px-8 md:px-16">
      <div className="px-4 pt-6 pb-24">
        <Title value={`PARTICIPANT INFORMATION`} />

        <div className="mt-6 rounded border border-slate-400 bg-slate-100 px-4 py-3 text-slate-700">
          {edit && (
            <div className="mt-2 mb-4 rounded-sm border-2 border-red-400  bg-red-100 py-1 px-2 text-red-700 transition-all">
              <h3 className="mb-1 flex items-center gap-1 text-2xl font-medium">
                NOTICE REMINDER <CgDanger />{" "}
              </h3>
              <p>
                Please be reminded that the option to edit your shirt size and
                distance on our website is available for a limited time only. We
                recommend that you update your preferences as soon as possible
                to ensure that your choices is processed correctly.
              </p>
              <p className="font-semibold">
                ***WALK IN USER SHOULD ONLY BE ABLE TO EDIT JUST THEIR NAME***
              </p>
            </div>
          )}

          <div className="mb-6 flex items-center">
            <h2 className="text-xl font-medium md:text-2xl">
              Registration No.{" "}
              <span className="font-semibold">
                {participant.registrationNumber}
              </span>
            </h2>

            {!edit &&
              eventData.closeRegistration &&
              participant.firstName.indexOf("ANONYMOUS") !== -1 &&
              participant.lastName.indexOf("ANONYMOUS") !== -1 &&
              participant.address &&
              participant.address.indexOf("ANONYMOUS") !== -1 && (
                <button
                  onClick={() => {
                    setEdit(true);
                  }}
                  className="ml-auto flex cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-stone-600 py-1 px-2 font-semibold hover:bg-slate-200 md:mr-4"
                >
                  EDIT <AiOutlineEdit className="text-xl md:text-2xl" />
                </button>
              )}

            {!edit && !eventData.closeRegistration && (
              <button
                onClick={() => {
                  setEdit(true);
                }}
                className="ml-auto flex cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-stone-600 py-1 px-2 font-semibold hover:bg-slate-200 md:mr-4"
              >
                EDIT <AiOutlineEdit className="text-xl md:text-2xl" />
              </button>
            )}

            {edit &&
              eventData.closeRegistration &&
              participant.firstName.indexOf("ANONYMOUS") !== -1 &&
              participant.lastName.indexOf("ANONYMOUS") !== -1 &&
              participant.address &&
              participant.address.indexOf("ANONYMOUS") !== -1 && (
                <button
                  onClick={() => {
                    setEdit(false);
                  }}
                  className="ml-auto flex cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-red-400 bg-red-100  py-1 px-2 font-semibold text-red-700 transition-all hover:bg-red-200 md:mr-4"
                >
                  EXIT{" "}
                  <AiOutlineClose className="text-xl text-red-700 md:text-2xl" />
                </button>
              )}

            {edit && !eventData.closeRegistration && (
              <button
                onClick={() => {
                  setEdit(false);
                }}
                className="ml-auto flex cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-red-400 bg-red-100  py-1 px-2 font-semibold text-red-700 transition-all hover:bg-red-200 md:mr-4"
              >
                EXIT{" "}
                <AiOutlineClose className="text-xl text-red-700 md:text-2xl" />
              </button>
            )}
          </div>

          {!edit && (
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1 flex flex-col gap-2 md:col-span-1">
                <div>
                  <p className="font-semibold">First Name</p>
                  <p>{participant.lastName}</p>
                </div>
                <div>
                  <p className="font-semibold">Last Name</p>
                  <p>{participant.firstName}</p>
                </div>
              </div>
              <div className="col-span-1 flex flex-col gap-2 md:col-span-1">
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

          {edit &&
            eventData.closeRegistration &&
            participant.firstName.indexOf("ANONYMOUS") !== -1 &&
            participant.lastName.indexOf("ANONYMOUS") !== -1 &&
            participant.address &&
            participant.address.indexOf("ANONYMOUS") !== -1 && (
              /* eslint-disable @typescript-eslint/no-misused-promises */
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-2"
              >
                <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
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
                <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
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

          {edit && !eventData.closeRegistration && (
            /* eslint-disable @typescript-eslint/no-misused-promises */
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-2"
            >
              <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
                <div className="md:mb-3">
                  <p className="font-semibold">First Name</p>
                  <p>{participant.lastName}</p>
                </div>
                <div>
                  <p className="font-semibold">Last Name</p>
                  <p>{participant.firstName}</p>
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
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
                              (selectedOption) =>
                                selectedOption === option.value
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

        {(eventData.timeStart3km ||
          eventData.timeStart5km ||
          eventData.timeStart10km) &&
          participant.kilometers &&
          participant.kilometers[0]?.timeFinished && (
            <button
              onClick={() => {
                setShowCertificate((prevState) => !prevState);
              }}
              className="mt-4 w-full rounded-md border-2 border-solid border-sky-400 bg-sky-100 py-2 text-sky-700 hover:bg-sky-200 active:bg-sky-200"
            >
              SHOW CERTIFICATE
            </button>
          )}

        {(eventData.timeStart3km ||
          eventData.timeStart5km ||
          eventData.timeStart10km) &&
          participant.kilometers &&
          participant.kilometers[0]?.timeFinished &&
          showCertificate && (
            <>
              <>
                <div
                  ref={certL}
                  className="relative hidden h-[571px] w-[800px] lg:block"
                >
                  <img
                    src={"/cerfifates/hermosa.jpg"}
                    // width={800}
                    // height={1000}
                    alt="hermosa certificate"
                    onContextMenu={(e) => e.preventDefault()}
                    className="absolute inset-40 left-0 top-0"
                  ></img>
                  <div className="absolute inset-60 top-[215px] left-[350px] right-[65px] z-10 flex justify-center text-2xl ">
                    <p className="text-[24px] font-semibold">
                      {participant.firstName} {participant.lastName}
                    </p>
                  </div>
                  <div className="absolute top-[263px] right-[232px] left-[500px] flex justify-center">
                    <p className="text-[19px] font-bold">
                      {participant.kilometers[0].distance} KM
                    </p>
                  </div>
                  <div className="absolute top-[348px] right-[100px] left-[560px]">
                    <p className="text-[13px] font-medium">
                      {eventData.timeStart5km &&
                      participant.kilometers[0].distance === 5
                        ? `${(
                            (participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                            1000 /
                            60 /
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}:${(
                            ((participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                              1000 /
                              60) %
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}:${(
                            ((participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                              1000) %
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}`
                        : "00:00:00"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await handleDownloadImage(certL);
                  }}
                  className="mt-4 hidden animate-bounce cursor-pointer gap-1 rounded-md border-2 py-1 px-4 font-medium hover:bg-slate-200 lg:flex lg:items-center lg:justify-center"
                >
                  DOWNLOAD CERTIFICATE <FiDownload />
                </button>
              </>

              <>
                <div
                  ref={certMd}
                  className="relative hidden h-[428px] max-h-[500px] w-[600px] max-w-[600px] md:block lg:hidden"
                >
                  <img
                    src={"/cerfifates/hermosa.jpg"}
                    // width={1000}
                    // height={1000}
                    onContextMenu={(e) => e.preventDefault()}
                    alt="hermosa certificate"
                    className="absolute inset-40 left-0 top-0"
                  ></img>
                  <div className="absolute inset-60 top-[158px] left-[270px] right-[50px] z-10 flex justify-center text-xl">
                    <p className="text-[20px] font-semibold ">
                      {participant.firstName} {participant.lastName}
                    </p>
                  </div>
                  <div className="absolute top-[196px] right-[170px] left-[372px] flex justify-center">
                    <p className="text-[15px] font-bold">
                      {participant.kilometers[0].distance} KM
                    </p>
                  </div>
                  <div className="absolute top-[261px] right-[60px] left-[420px]">
                    <p className="text-[10px] font-medium">
                      {eventData.timeStart5km &&
                      participant.kilometers[0].distance === 5
                        ? `${(
                            (participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                            1000 /
                            60 /
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}:${(
                            ((participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                              1000 /
                              60) %
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}:${(
                            ((participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                              1000) %
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}`
                        : "00:00:00"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await handleDownloadImage(certMd);
                  }}
                  className="mt-4 hidden animate-bounce cursor-pointer gap-1 rounded-md border-2 py-1 px-4 font-medium hover:bg-slate-200 md:flex md:items-center md:justify-center lg:hidden"
                >
                  DOWNLOAD CERTIFICATE <FiDownload />
                </button>
              </>

              <>
                <div
                  ref={certSm}
                  className="relative hidden h-[356px] max-h-[500px] w-[500px] max-w-[500px] sm:block md:hidden lg:hidden"
                >
                  <img
                    src={"/cerfifates/hermosa.jpg"}
                    // width={1000}
                    // height={1000}
                    onContextMenu={(e) => e.preventDefault()}
                    alt="hermosa certificate"
                    className="absolute inset-40 left-0 top-0"
                  ></img>
                  <div className="absolute inset-60 top-[128px] left-[220px] right-[44px] z-10 flex justify-center text-xl">
                    <p className="text-[18px] font-semibold ">
                      {participant.firstName} {participant.lastName}
                    </p>
                  </div>
                  <div className="absolute top-[162px] right-[140px] left-[310px] flex justify-center">
                    <p className="text-[13px] font-bold">
                      {participant.kilometers[0].distance} KM
                    </p>
                  </div>
                  <div className="absolute top-[218px] right-[50px] left-[350px]">
                    <p className="text-[8px] font-medium">
                      {eventData.timeStart5km &&
                      participant.kilometers[0].distance === 5
                        ? `${(
                            (participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                            1000 /
                            60 /
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}:${(
                            ((participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                              1000 /
                              60) %
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}:${(
                            ((participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                              1000) %
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}`
                        : "00:00:00"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await handleDownloadImage(certSm);
                  }}
                  className="mt-4 hidden animate-bounce cursor-pointer gap-1 rounded-md border-2 py-1 px-4 font-medium hover:bg-slate-200 sm:flex sm:items-center sm:justify-center md:hidden"
                >
                  DOWNLOAD CERTIFICATE <FiDownload />
                </button>
              </>

              <>
                <div
                  ref={certXs}
                  className="relative h-[214px] max-h-[300px] w-[300px] max-w-[300px] sm:hidden md:hidden lg:hidden"
                >
                  <img
                    src={"/cerfifates/hermosa.jpg"}
                    // width={1000}
                    // height={1000}
                    onContextMenu={(e) => e.preventDefault()}
                    alt="hermosa certificate"
                    className="absolute inset-40 left-0 top-0"
                  ></img>
                  <div className="absolute inset-60 top-[72px] left-[130px] right-[27px] z-10 flex justify-center text-xl">
                    <p className="text-[10px] font-semibold ">
                      {participant.firstName} {participant.lastName}
                    </p>
                  </div>
                  <div className="absolute top-[97px] right-[85px] left-[188px] flex justify-center">
                    <p className="text-[7px] font-bold">
                      {participant.kilometers[0].distance} KM
                    </p>
                  </div>
                  <div className="absolute top-[131px] right-[60px] left-[211px]">
                    <p className="text-[4px] font-medium">
                      {eventData.timeStart5km &&
                      participant.kilometers[0].distance === 5
                        ? `${(
                            (participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                            1000 /
                            60 /
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}:${(
                            ((participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                              1000 /
                              60) %
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}:${(
                            ((participant.kilometers[0].timeFinished.getTime() -
                              eventData.timeStart5km.getTime()) /
                              1000) %
                            60
                          )
                            .toFixed(0)
                            .toString()
                            .padStart(2, "0")}`
                        : "00:00:00"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await handleDownloadImage(certXs);
                  }}
                  className="mt-4 flex animate-bounce cursor-pointer items-center justify-center gap-1 rounded-md border-2 py-1 px-4 font-medium hover:bg-slate-200 sm:hidden"
                >
                  DOWNLOAD CERTIFICATE <FiDownload />
                </button>
              </>
            </>
          )}
      </div>
    </ScreenContainer>
  );
};

export default Participant;
