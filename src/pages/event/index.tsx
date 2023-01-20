import { type NextPage } from "next";
import Link from "next/link";
import { api } from "../../utils/api";
import Image from "next/image";
import dayjs from "dayjs";
import Title from "../../components/Title";

const Event: NextPage = () => {
  const { data: events } = api.event.getAll.useQuery();

  console.log(events);

  return (
    <div className="pt-6">
      <Title value="List of all events" />
      <div className="grid grid-cols-6 gap-4 pt-6">
        {events &&
          events.map(({ id, scheduleTimeStart, name, participant }) => (
            <div
              key={id}
              className="col-span-6 w-full sm:col-span-3 lg:col-span-2"
            >
              <div className="rounded-md bg-km10 p-2">
                <div className="h-28 bg-km3"></div>
                <div className="bg-white py-6 px-4">
                  <h3 className="mb-4 text-3xl">{name}</h3>
                  <div className="mb-4">
                    <p>
                      {dayjs(scheduleTimeStart).format("dddd")},{" "}
                      {dayjs(scheduleTimeStart).format("MMMM")}{" "}
                      {dayjs(scheduleTimeStart).format("DD")}{" "}
                      <span className="font-black">&#183; </span>
                      {dayjs(scheduleTimeStart).format("h")}
                      {" : "}
                      {dayjs(scheduleTimeStart).format("mm")}{" "}
                      {dayjs(scheduleTimeStart).format("A")}{" "}
                    </p>
                    <p>
                      No. of participants{" "}
                      {participant ? participant.length : "0"}
                    </p>
                  </div>

                  <Link href={`/register/${id}`}>
                    <div className="w-full border-2 py-4 text-center">
                      REGISTER
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Event;
