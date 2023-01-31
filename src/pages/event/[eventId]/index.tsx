import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { type Kilometer } from "@prisma/client";

import { api } from "../../../utils/api";

import StartButton from "../../../components/StartButton";

import { GoPrimitiveDot } from "react-icons/go";
import { GiCheckeredFlag } from "react-icons/gi";

const SingeEvent: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const {
    data: eventData,
    isLoading,
    refetch,
  } = api.event.fullDetails.useQuery({
    eventId: eventId as string,
  });

  if (isLoading) {
    return <></>;
  }

  if (!eventData) {
    return (
      <ScreenContainer>
        <div className="mx-auto pt-20">
          <p className="text-3xl">Event not found!</p>
        </div>
      </ScreenContainer>
    );
  }

  const refetchEvent = async () => {
    await refetch();
  };

  const filterParticipants = (distanceF: number, kilometer: Kilometer[]) => {
    const filteredParticipants = kilometer.filter(({ distance }) => {
      return distance === distanceF;
    });

    return filteredParticipants.length;
  };

  return (
    <ScreenContainer className="mx-auto px-8 py-6 md:px-16">
      {/* <h2 className="text-center text-6xl font-semibold">
        Welcome to {eventData.name}
      </h2> */}
      <div className="mb-2 grid grid-cols-2 gap-2">
        <Link
          href={`/event/${eventData.id}/camera`}
          className="col-span-1 flex items-center justify-center border-2 border-dotted border-slate-400 py-2 font-semibold"
        >
          CAMERA
        </Link>

        <Link
          href={`/event/${eventData.id}/config`}
          className="col-span-1 flex items-center justify-center  border-2 border-dotted border-slate-400 py-2 font-semibold"
        >
          CONFIGURATION
        </Link>
        <Link
          href={`/event/${eventData.id}/list`}
          className="col-span-2 flex items-center justify-center border-2  border-dotted border-slate-400 py-2 font-semibold md:col-span-1"
        >
          PARTICIPANTS LIST
        </Link>
      </div>

      <div className="mx-auto grid grid-cols-6 gap-4">
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md bg-km3 p-3 font-semibold text-white md:col-span-3 lg:col-span-2">
          <h2 className="text-5xl">3 KM</h2>
          {/* <CustomClock /> */}

          <StartButton
            kilometer="3"
            timeStart={eventData?.timeStart3km}
            eventId={eventData.id}
            raceFinished={eventData.raceFinished3km}
            /* eslint-disable @typescript-eslint/no-misused-promises */
            refetchEvent={refetchEvent}
          />

          {eventData.timeStart3km && (
            <Link href={`/event/${eventData.id}/finisher`}>
              <div className="border-2 border-dashed border-white p-2 text-xl font-semibold">
                {eventData.raceFinished3km ? (
                  <div className="flex items-center justify-center gap-2">
                    CHECK STATUS{" "}
                    <GiCheckeredFlag className="text-4xl text-white" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    LIVE FEED{" "}
                    <GoPrimitiveDot className="text-4xl text-red-700" />
                  </div>
                )}
              </div>
            </Link>
          )}

          <div className="mt-auto w-full border-b-2 border-double border-b-slate-100"></div>
          <p className="text-xl font-medium">Registered Participants</p>
          <p className="text-3xl font-medium">
            {filterParticipants(3, eventData.kilometer)}
          </p>
        </div>
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md bg-km5 p-3 font-semibold text-white md:col-span-3 lg:col-span-2">
          <h2 className="text-5xl">5 KM</h2>
          {/* <CustomClock /> */}
          <StartButton
            kilometer="5"
            timeStart={eventData?.timeStart5km}
            eventId={eventData.id}
            raceFinished={eventData.raceFinished5km}
            /* eslint-disable @typescript-eslint/no-misused-promises */
            refetchEvent={refetchEvent}
          />

          {eventData.timeStart5km && (
            <Link href={`/event/${eventData.id}/finisher`}>
              <div className=" border-2 border-dashed p-2 text-xl font-semibold">
                {eventData.raceFinished5km ? (
                  <div className="flex items-center justify-center gap-2">
                    CHECK STATUS <GiCheckeredFlag className="text-4xl" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    LIVE FEED{" "}
                    <GoPrimitiveDot className="text-4xl text-red-700" />
                  </div>
                )}
              </div>
            </Link>
          )}
          <div className="mt-auto w-full border-b-2 border-double border-b-slate-100"></div>
          <p className="text-xl font-medium">Registered Participants</p>
          <p className="text-3xl font-medium">
            {filterParticipants(5, eventData.kilometer)}
          </p>
        </div>
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md bg-km10 p-3 font-semibold text-white md:col-span-6 lg:col-span-2">
          <h2 className="text-5xl">10 KM</h2>
          {/* <CustomClock /> */}
          <StartButton
            kilometer="10"
            timeStart={eventData?.timeStart10km}
            eventId={eventData.id}
            raceFinished={eventData.raceFinished10km}
            /* eslint-disable @typescript-eslint/no-misused-promises */
            refetchEvent={refetchEvent}
          />

          {eventData.timeStart10km && (
            <Link href={`/event/${eventData.id}/finisher`}>
              <div className=" border-2 border-dashed p-2 text-xl font-semibold">
                {eventData.raceFinished10km ? (
                  <div className="flex items-center justify-center gap-2">
                    CHECK STATUS <GiCheckeredFlag className="text-4xl" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    LIVE FEED{" "}
                    <GoPrimitiveDot className="text-4xl text-red-700" />
                  </div>
                )}
              </div>
            </Link>
          )}
          <div className="mt-auto w-full border-b-2 border-double border-b-slate-100"></div>
          <p className="text-xl font-medium">Registered Participants</p>
          <p className="text-3xl font-medium">
            {filterParticipants(10, eventData.kilometer)}
          </p>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default SingeEvent;

import { getSession } from "next-auth/react";
import type { GetServerSideProps } from "next";
import ScreenContainer from "../../../layouts/ScreenContainer";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (session.user?.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
