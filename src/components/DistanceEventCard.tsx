import { type Kilometer } from "@prisma/client";

import Stopwatch from "./StopWatch";

type Props = {
  distanceNumber: number;
  kilometer: Kilometer[];
};

const DistanceEventCard = ({ distanceNumber, kilometer }: Props) => {
  const filteredParticipants = kilometer.filter(({ distance }) => {
    return distance !== distanceNumber;
  });

  return (
    <div className="col-span-6 flex flex-col items-center justify-start gap-4 rounded-md bg-km3 p-3 font-semibold text-slate-100 md:col-span-3 lg:col-span-2">
      <h2 className="text-5xl">3 KM</h2>
      <Stopwatch />
      <div className="w-full border-b-2 border-double border-b-slate-100"></div>
      <p className="text-xl font-medium">Registered Participants</p>
      <p className="text-3xl font-medium">{filteredParticipants.length}</p>
    </div>
  );
};

export default DistanceEventCard;
