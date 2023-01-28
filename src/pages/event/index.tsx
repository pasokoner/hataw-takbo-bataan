import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { api } from "../../utils/api";

import dayjs from "dayjs";
import Title from "../../components/Title";
import { GoPrimitiveDot } from "react-icons/go";

import { useSession } from "next-auth/react";

import { BiCog } from "react-icons/bi";
import { BsJoystick } from "react-icons/bs";
import ScreenContainer from "../../layouts/ScreenContainer";

const Event: NextPage = () => {
  const { data: events, isLoading } = api.event.getAll.useQuery();

  const { data: sessionData } = useSession();

  if (isLoading) {
    return (
      <ScreenContainer className="mx-auto px-8 md:px-16">
        <div className="pt-6">
          <Title value="List of all events" />
          <div className="grid grid-cols-6 gap-4 pt-6">
            <div className="col-span-6 w-full animate-pulse rounded-md border border-slate-400 p-4 shadow sm:col-span-3 lg:col-span-2">
              <div className="">
                <div className="mb-2 h-36 rounded-md border-2 border-slate-400"></div>
                <div className="mb-2 space-y-6 py-1">
                  <div className="h-2 rounded bg-slate-400"></div>
                  <div className="h-2 rounded bg-slate-400"></div>
                  <div className="h-2 rounded bg-slate-400"></div>
                </div>
                <div className="h-14 rounded-md bg-slate-200 py-4"></div>
              </div>
            </div>

            <div className="col-span-6 w-full animate-pulse rounded-md border border-slate-300 p-4 shadow sm:col-span-3 lg:col-span-2">
              <div className="">
                <div className="mb-2 h-36 rounded-md border-2 border-slate-300"></div>
                <div className="mb-2 space-y-6 py-1">
                  <div className="h-2 rounded bg-slate-300"></div>
                  <div className="h-2 rounded bg-slate-300"></div>
                  <div className="h-2 rounded bg-slate-300"></div>
                </div>
                <div className="h-14 rounded-md bg-slate-200 py-4"></div>
              </div>
            </div>

            <div className="col-span-6 w-full animate-pulse rounded-md border border-slate-300 p-4 shadow sm:col-span-3 lg:col-span-2">
              <div className="">
                <div className="mb-2 h-36 rounded-md border-2 border-slate-300"></div>
                <div className="mb-2 space-y-6 py-1">
                  <div className="h-2 rounded bg-slate-300"></div>
                  <div className="h-2 rounded bg-slate-300"></div>
                  <div className="h-2 rounded bg-slate-300"></div>
                </div>
                <div className="h-14 rounded-md bg-slate-200 py-4"></div>
              </div>
            </div>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="mx-auto px-8 py-16 md:px-16">
      <Title value="List of all events" />
      <div className="grid grid-cols-6 gap-4 pt-6">
        {events &&
          events
            .filter(({ name }) => name !== "test")
            .map(
              ({
                id,
                scheduleTimeStart,
                name,
                _count,
                registerFrom,
                registerTo,
                timeStart10km,
                timeStart3km,
                timeStart5km,
                raceFinished10km,
                raceFinished5km,
                raceFinished3km,
                closeRegistration,
              }) => {
                // const registrationExpiration =
                //   registerTo.getTime() - registerFrom.getTime();

                const ongoingEvent =
                  !!timeStart3km || !!timeStart5km || !!timeStart10km;

                const eventFinished =
                  !!raceFinished3km && !!raceFinished5km && !!raceFinished10km;

                return (
                  <div
                    key={id}
                    className="col-span-6 w-full md:col-span-3 xl:col-span-2"
                  >
                    <div className="rounded-md bg-km10 p-2">
                      <div className="relative h-28 bg-km3">
                        <div className="absolute top-2 left-2 z-10 rounded-lg bg-white p-1 opacity-70">
                          {!closeRegistration &&
                            !eventFinished &&
                            !ongoingEvent && (
                              <div className="flex items-center gap-1 text-xs">
                                LIVE REGISTRATION{" "}
                                <GoPrimitiveDot className="text-red-600" />
                              </div>
                            )}
                          {closeRegistration &&
                            !eventFinished &&
                            !ongoingEvent && (
                              <div className="flex items-center gap-1 text-xs">
                                CLOSED REGISTRATION{" "}
                                <GoPrimitiveDot className="text-slate-600" />
                              </div>
                            )}

                          {closeRegistration &&
                            !eventFinished &&
                            ongoingEvent && (
                              <div className="flex items-center gap-1 text-xs">
                                EVENT ONGOING{" "}
                                <GoPrimitiveDot className="text-yellow-600" />
                              </div>
                            )}

                          {closeRegistration &&
                            eventFinished &&
                            ongoingEvent && (
                              <div className="flex items-center gap-1 text-xs">
                                EVENT ENDED{" "}
                                <GoPrimitiveDot className="text-emerald-600" />
                              </div>
                            )}
                        </div>{" "}
                        <Image
                          src={
                            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80"
                          }
                          alt=""
                          fill
                        />
                      </div>
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
                          <p>No. of participants {_count.participant}</p>
                        </div>

                        <Link href={`/event/${id}/register`}>
                          <div className="mb-2 w-full border-2 py-4 text-center">
                            REGISTER
                          </div>
                        </Link>

                        {/* {eventData} */}
                        {closeRegistration &&
                          (!!timeStart10km ||
                            !!timeStart5km ||
                            !!timeStart3km) && (
                            <Link href={`/event/${id}/participant`}>
                              <div className="mb-2 w-full border-2 py-4 text-center">
                                CERTIFICATE
                              </div>
                            </Link>
                          )}
                        {!closeRegistration && (
                          <Link href={`/event/${id}/participant`}>
                            <div className="mb-2 w-full border-2 py-4 text-center">
                              EDIT/VIEW DETAILS
                            </div>
                          </Link>
                        )}

                        {sessionData && sessionData.user?.role === "ADMIN" && (
                          <Link href={`/event/${id}`}>
                            <div className="mb-2 flex w-full items-center justify-center gap-1 border-2 py-4">
                              EVENT CONTROL <BsJoystick />
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
      </div>
    </ScreenContainer>
  );
};

export default Event;
