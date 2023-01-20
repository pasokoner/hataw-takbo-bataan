import React from "react";

import { FaPlay, FaStop } from "react-icons/fa";
import { api } from "../utils/api";
import dayjs from "dayjs";

type Props = {
  kilometer: "3" | "5" | "10";
  raceFinished: boolean;
  timeStart: Date | null;
  eventId: string;
  refetchEvent: () => void;
};

const StartButton = ({
  kilometer,
  timeStart,
  eventId,
  raceFinished,
  refetchEvent,
}: Props) => {
  const { mutate: startRace } = api.event.start.useMutation({
    onSuccess: () => {
      refetchEvent();
    },
  });

  const { mutate: endRace } = api.event.end.useMutation({
    onSuccess: () => {
      refetchEvent();
    },
  });

  const updateTimeStart = (
    kilometer: "3" | "5" | "10",
    timeStart: Date,
    eventId: string
  ) => {
    startRace({ kilometer: kilometer, timeStart, eventId });
  };

  const updateRaceStatus = (kilometer: "3" | "5" | "10", eventId: string) => {
    endRace({ kilometer, eventId });
  };

  let content;

  if (timeStart) {
    content = (
      <>
        <p className="text-4xl sm:text-5xl">
          {dayjs(timeStart).format("hh")}
          {" : "}
          {dayjs(timeStart).format("mm")}
          {" : "}
          {dayjs(timeStart).format("ss")} {dayjs(timeStart).format("A")}
        </p>
        {raceFinished ? (
          <div className="flex w-full items-center justify-center gap-4 border-2 bg-slate-600 py-4 px-2 text-4xl font-semibold text-white">
            RACE END
          </div>
        ) : (
          <button
            onClick={() => {
              updateRaceStatus(kilometer, eventId);
            }}
            className="flex w-full items-center justify-center gap-4 border-2 bg-slate-600 py-4 px-2 text-4xl font-semibold text-white transition-all hover:bg-slate-700"
          >
            END RACE
            <FaStop className="text-red-500" />
          </button>
        )}
      </>
    );
  } else {
    content = (
      <>
        <p className="text-4xl sm:text-5xl">-- : -- : -- --</p>
        <button
          onClick={() => {
            updateTimeStart(kilometer, new Date(), eventId);
          }}
          className="flex w-full items-center justify-center gap-4 border-2 bg-slate-600 py-4 px-2 text-4xl font-semibold text-white transition-all hover:bg-slate-700"
        >
          START
          <FaPlay />
        </button>
      </>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">{content}</div>
  );
};

export default StartButton;
