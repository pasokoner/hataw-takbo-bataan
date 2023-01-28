import React, { useState } from "react";
import Modal from "./Modal";

import { useForm, SubmitHandler } from "react-hook-form";
import { RiLoader5Fill } from "react-icons/ri";

import { api } from "../utils/api";

type Props = {
  participantId: string;
  registrationNumber: number;
  firstName: string;
  lastName: string;
  refetchFn: () => void;
};

const EditName = ({
  participantId,
  registrationNumber,
  lastName,
  firstName,
  refetchFn,
}: Props) => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const { mutate, isLoading } = api.participant.editName.useMutation({
    onSuccess: () => {
      refetchFn();
      setShow(false);
    },
    onError: () => {
      setError("Some error has occured");
    },
  });

  const { register, handleSubmit, watch } = useForm<{
    firstName: string;
    lastName: string;
  }>();

  const onSubmit: SubmitHandler<{ firstName: string; lastName: string }> = (
    data
  ) => {
    setError("");
    if (data) {
      const { firstName, lastName } = data;

      mutate({
        participantId: participantId,
        firstName: firstName.trim().toUpperCase(),
        lastName: lastName.trim().toUpperCase(),
      });
    }
  };

  return (
    <>
      <button
        className="rounded-md border-2 border-primary py-1 px-2 font-medium uppercase"
        onClick={() => setShow(true)}
      >
        Edit
      </button>
      <Modal
        title={`Registration #${registrationNumber}`}
        show={show}
        onClose={() => setShow(false)}
      >
        {/* eslint-disable @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 md:col-span-1 md:min-w-[25rem]">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              required
              defaultValue={firstName}
              {...register("firstName")}
              className="uppercase"
            />
          </div>
          <div className="mb-3 flex flex-col gap-2 md:col-span-1 md:min-w-[25rem]">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              required
              defaultValue={lastName}
              {...register("lastName")}
              className="uppercase"
            />
          </div>

          {error && <p className="mb-2 text-lg text-red-600">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShow(false)}
              className="rounded-md border-2 border-solid bg-red-500 py-2 text-white disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isLoading ||
                (watch("firstName") === firstName &&
                  watch("lastName") === lastName)
              }
              className="flex items-center justify-center rounded-md border-2 border-solid bg-primary py-2 text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {isLoading ? (
                <RiLoader5Fill className="animate-spin text-center text-2xl" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditName;
