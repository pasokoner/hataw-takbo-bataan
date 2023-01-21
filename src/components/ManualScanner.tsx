import React from "react";

import { type Event } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";

import { AiOutlineEnter } from "react-icons/ai";

type Props = {
  manualUpdate: (query: string, timeFinished: Date, eventData: Event) => void;
  eventData: Event;
};

const ManualScanner = ({ manualUpdate, eventData }: Props) => {
  const { register, handleSubmit } = useForm<{
    query: string;
  }>();

  const onSubmit: SubmitHandler<{ query: string }> = (data) => {
    const now = new Date();

    manualUpdate(data.query, now, eventData);
  };

  return (
    /* eslint-disable @typescript-eslint/no-misused-promises */
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
      <input
        type="text"
        className="mr-2 flex-1"
        {...register("query")}
        required
      />
      <button
        type="submit"
        className="rounded-md border-2 py-2 px-4 transition-all active:translate-y-1"
      >
        <AiOutlineEnter />
      </button>
    </form>
  );
};

export default ManualScanner;
