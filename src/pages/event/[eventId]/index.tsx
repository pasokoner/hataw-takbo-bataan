import { type NextPage } from "next";

import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import CustomClock from "../../../components/StopWatch";
import { type Kilometer } from "@prisma/client";
import StartButton from "../../../components/StartButton";

import Link from "next/link";

import { GoPrimitiveDot } from "react-icons/go";
import { GiCheckeredFlag } from "react-icons/gi";

const SingeEvent: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const {
    data: eventData,
    isLoading,
    refetch,
  } = api.event.details.useQuery({
    eventId: eventId as string,
  });

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
    <div className="py-6">
      {/* <h2 className="text-center text-6xl font-semibold">
        Welcome to {eventData.name}
      </h2> */}
      <div className="mx-auto grid grid-cols-6 gap-4">
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md bg-km3 p-3 font-semibold md:col-span-3 lg:col-span-2">
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
            <Link href={"/"}>
              <div className=" border-2 border-dashed border-black p-2 text-xl font-semibold">
                {eventData.raceFinished3km ? (
                  <div className="flex items-center justify-center gap-2">
                    CHECK STATUS{" "}
                    <GiCheckeredFlag className="text-4xl text-black" />
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
            <Link href={"/"}>
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
            <Link href={"/"}>
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
          <div className="w-full border-b-2 border-double border-b-slate-100"></div>
          <p className="text-xl font-medium">Registered Participants</p>
          <p className="text-3xl font-medium">
            {filterParticipants(10, eventData.kilometer)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingeEvent;
