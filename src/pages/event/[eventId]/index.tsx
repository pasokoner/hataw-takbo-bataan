import { type NextPage } from "next";

import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import CustomClock from "../../../components/StopWatch";
import { Kilometer } from "@prisma/client";

const SingeEvent: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const { data: eventData, isLoading } = api.event.name.useQuery({
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

  const filterParticipants = (distanceF: number, kilometer: Kilometer[]) => {
    const filteredParticipants = kilometer.filter(({ distance }) => {
      return distance === distanceF;
    });

    return filteredParticipants.length;
  };

  return (
    <div>
      <h2 className="text-center text-6xl">Welcome to {eventData.name}</h2>
      <div className="mx-auto grid grid-cols-6 gap-4 pt-12">
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md bg-km3 p-3 font-semibold md:col-span-3 lg:col-span-2">
          <h2 className="text-5xl">3 KM</h2>
          <CustomClock />
          <div className="w-full border-b-2 border-double border-b-slate-100"></div>
          <p className="text-xl font-medium">Registered Participants</p>
          <p className="text-3xl font-medium">
            {filterParticipants(3, eventData.kilometer)}
          </p>
        </div>
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md bg-km5 p-3 font-semibold text-white md:col-span-3 lg:col-span-2">
          <h2 className="text-5xl">5 KM</h2>
          <CustomClock />
          <div className="w-full border-b-2 border-double border-b-slate-100"></div>
          <p className="text-xl font-medium">Registered Participants</p>
          <p className="text-3xl font-medium">
            {filterParticipants(5, eventData.kilometer)}
          </p>
        </div>
        <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md bg-km10 p-3 font-semibold text-white md:col-span-6 lg:col-span-2">
          <h2 className="text-5xl">10 KM</h2>
          <CustomClock />
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
