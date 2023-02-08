import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

import { useSession } from "next-auth/react";

import { api } from "../../utils/api";

import dayjs from "dayjs";

import ScreenContainer from "../../layouts/ScreenContainer";

import { BsJoystick } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";

const Event: NextPage = () => {
  const { data: events, isLoading } = api.event.getAll.useQuery();

  const { data: sessionData } = useSession();

  if (isLoading) {
    return (
      <ScreenContainer>
        <div className="pt-6">
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
    <ScreenContainer className="py-6 text-gray-700">
      <h3 className="text-2xl font-medium text-gray-600">ALL EVENTS</h3>
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
                timeStart10km,
                timeStart3km,
                timeStart5km,
                raceFinished10km,
                raceFinished5km,
                raceFinished3km,
                closeRegistration,
              }) => {
                const ongoingEvent =
                  !!timeStart3km || !!timeStart5km || !!timeStart10km;

                const eventFinished =
                  !!raceFinished3km && !!raceFinished5km && !!raceFinished10km;

                return (
                  <div
                    key={id}
                    className="col-span-6 w-full sm:col-span-3 lg:col-span-2"
                  >
                    <div className="rounded-md border-2 border-slate-200">
                      <div className="relative h-28 bg-km3">
                        <div className="absolute top-2 left-2 z-10 rounded-lg bg-white p-1 opacity-70">
                          {!closeRegistration &&
                            !eventFinished &&
                            !ongoingEvent && (
                              <div className="flex items-center gap-1 text-xs">
                                LIVE REGISTRATION{" "}
                                <GoPrimitiveDot className="text-emerald-600" />
                              </div>
                            )}
                          {closeRegistration &&
                            !eventFinished &&
                            !ongoingEvent && (
                              <div className="flex items-center gap-1 text-xs">
                                CLOSED REGISTRATION{" "}
                                <GoPrimitiveDot className="text-red-600" />
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
                                <GoPrimitiveDot className="text-gray-600" />
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
                        <h3 className="mb-4 text-xl">{name}</h3>
                        <div className="mb-4 text-sm">
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

                        {!closeRegistration && (
                          <Link href={`/event/${id}/register`}>
                            <div className="mb-2 w-full rounded-sm border-[1px] bg-primary py-2 text-center text-white hover:bg-primary-hover">
                              REGISTER
                            </div>
                          </Link>
                        )}

                        {/* {eventData} */}
                        {closeRegistration &&
                          (!!timeStart10km ||
                            !!timeStart5km ||
                            !!timeStart3km) && (
                            <Link href={`/event/${id}/participant`}>
                              <div className="mb-2 w-full rounded-sm border-[1px] border-primary bg-white py-2 text-center text-primary">
                                CLAIM CERTIFICATE
                              </div>
                            </Link>
                          )}
                        {!closeRegistration && (
                          <Link href={`/event/${id}/participant`}>
                            <div className="mb-2 w-full rounded-sm border-[1px] border-primary bg-white py-2 text-center text-primary">
                              EDIT/VIEW DETAILS
                            </div>
                          </Link>
                        )}

                        {sessionData && sessionData.user?.role === "ADMIN" && (
                          <Link href={`/event/${id}`}>
                            <div className="mb-2 flex w-full items-center justify-center gap-1 border-2 bg-red-600 py-4 text-white hover:opacity-90">
                              ADMIN CONTROL <BsJoystick />
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
