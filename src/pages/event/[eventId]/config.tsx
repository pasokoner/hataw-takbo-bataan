import { type NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { getSession } from "next-auth/react";
import type { GetServerSideProps } from "next";

import { api } from "../../../utils/api";

const Config: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const { data: eventData, isLoading } = api.event.details.useQuery({
    eventId: eventId as string,
  });

  const { mutate } = api.event.config.useMutation({
    onSuccess: () => {
      setSuccess("Configuration save!");
    },
  });

  const { register, handleSubmit } = useForm<{
    cameraPassword: string;
  }>();

  const [success, setSuccess] = useState("");

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

  const onSubmit: SubmitHandler<{ cameraPassword: string }> = (data) => {
    mutate({ ...data, eventId: eventData.id });
  };

  return (
    <div className="pt-6">
      <h2 className="mb-4 text-4xl">Event Configuration - {eventData.name}</h2>
      {/* eslint-disable @typescript-eslint/no-misused-promises */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
          <label htmlFor="cameraPassword">Camera Password:</label>
          <input
            type="text"
            id="cameraPassword"
            pattern="^\S*$"
            title="Avoid using whitespace"
            required
            defaultValue={eventData.cameraPassword}
            {...register("cameraPassword", {
              onChange: () => {
                setSuccess("");
              },
            })}
          />
        </div>

        {success && <p className="col-span-2 ml-2 text-green-500">{success}</p>}

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || session.user?.role !== "ADMIN") {
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
