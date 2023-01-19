import { type NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../../../utils/api";

const Config: NextPage = () => {
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

  return (
    <div className="pt-12">
      <h2 className="mb-4 text-4xl">
        Configure Event settings for {eventData.name}
      </h2>
      <form className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
          <label htmlFor="cameraPassword">Camera Password:</label>
          <input
            type="text"
            id="cameraPassword"
            pattern="^\S*$"
            title="Avoid using whitespace"
            required
            defaultValue={eventData.cameraPassword}
          />
        </div>
        <button
          type="submit"
          className="col-span-2 rounded-md border-2 bg-[#0062ad] py-1 text-white hover:bg-[#0d6cb5] disabled:opacity-60 md:max-w-xs"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Config;
