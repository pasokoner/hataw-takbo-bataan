import { useState } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";

import dayjs from "dayjs";

import {
  AgeGroup,
  Gender,
  Kilometer,
  Municipality,
  ShirtSize,
} from "@prisma/client";
import { type z } from "zod";
import { type participantSchema } from "../server/api/routers/participantBataan";
import { api } from "../utils/api";

import Modal from "./Modal";
import ScreenContainer from "../layouts/ScreenContainer";

type Props = {
  eventId: string;
  eventName: string;
};

type ParticipantBataan = z.infer<typeof participantSchema>;

type ParticipantOutsideBataan = Omit<ParticipantBataan, "municipality">;

const RegistrationForm = ({ eventId, eventName }: Props) => {
  const { mutate } = api.participant.register.useMutation();

  const { register, handleSubmit, watch } = useForm<
    ParticipantBataan | ParticipantOutsideBataan
  >();

  const onSubmit: SubmitHandler<
    ParticipantBataan | ParticipantOutsideBataan
  > = (data) => {
    if (data) {
      mutate({
        ...data,
        birthdate: dayjs(data.birthdate).toDate(),
        eventId,
      });
    }
  };

  const [outsideBataan, setOutsideBataan] = useState(false);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const handleToggleAddress = () => {
    setOutsideBataan((prevState) => !prevState);
  };

  const toggleClass = "transform translate-x-6 bg-blue  ";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
      {/* [&>*]:flex [&>*]:flex-col [&>*]:gap-2 */}

      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" required {...register("firstName")} />
      </div>
      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" required {...register("lastName")} />
      </div>

      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <label htmlFor="ageGroup">Age Group</label>
        <select id="ageGroup" required {...register("ageGroup")}>
          <option value={""}>Select Age group</option>
          {Object.keys(AgeGroup).map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <label htmlFor="gender">Gender</label>
        <select id="gender" required {...register("gender")}>
          <option value={""}>Select Gender</option>
          {Object.keys(Gender).map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <label htmlFor="birthdate">Birthdate</label>
        <input type="date" id="birthdate" required {...register("birthdate")} />
      </div>
      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <label htmlFor="email">
          Email <span className="text-slate-500">(Optional)</span>
        </label>
        <input type="text" id="email" {...register("email")} />
      </div>
      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <label htmlFor="contactNumber">Contact Number</label>
        <input
          type="text"
          id="contactNumber"
          required
          {...register("contactNumber")}
        />
      </div>

      <div className="col-span-2 border-b-2 py-2"></div>

      {/*   Switch Container */}
      <div className="col-span-2 flex items-center gap-4">
        <p>Outside From Bataan:</p>
        <div
          className="h-5 w-12 cursor-pointer items-center rounded-full bg-gray-400 p-1 md:h-7 md:w-14"
          onClick={handleToggleAddress}
        >
          {/* Switch */}
          <div
            className={`${
              outsideBataan ? toggleClass : ""
            } mr-auto h-3 w-5 transform rounded-full bg-slate-600 shadow-md duration-300 ease-in-out md:h-5 md:w-6`}
          ></div>
        </div>
      </div>

      {!outsideBataan && (
        <div className="col-span-2 flex flex-col gap-2">
          <label htmlFor="municipality">City/Municipality</label>
          <select id="municipality" required {...register("municipality")}>
            <option value={""}>Select City/Municipality</option>
            {Object.keys(Municipality).map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="col-span-2 flex flex-col gap-2">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          placeholder="House Number/Street Name, Barangay, Municipality, Province"
          required
          {...register("address")}
        />
      </div>

      <div className="col-span-2 border-b-2 py-3"></div>

      <div className="col-span-2 flex flex-col gap-2">
        <label htmlFor="kilometer">Kilometer/s</label>
        <select id="kilometer" required {...register("kilometer")}>
          <option value={""}>Choose...</option>
          {Object.keys(Kilometer).map((kilometer) => (
            <option key={kilometer} value={kilometer}>
              {kilometer}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-2 flex flex-col gap-2">
        <label htmlFor="shirtSize">Shirt Size</label>
        <select id="shirtSize" required {...register("shirtSize")}>
          <option value={""}>Choose...</option>
          {Object.keys(ShirtSize).map((shirtSize) => (
            <option key={shirtSize} value={shirtSize}>
              {shirtSize}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-2 border-b-2 py-3"></div>

      {/* <Modal show={true} /> */}

      <div className="col-span-2 flex flex-col gap-2">
        <label htmlFor="emergencyContact">In case of emergency, contact</label>
        <input
          type="text"
          id="emergencyContact"
          required
          {...register("emergencyContact")}
        />
      </div>

      <div className="col-span-2 flex flex-col gap-2">
        <label htmlFor="emergencyContactNumber">Contact Number</label>
        <input
          type="text"
          id="emergencyContactNumber"
          required
          {...register("emergencyContactNumber")}
        />
      </div>

      <Modal
        show={showAgreement}
        onClose={() => {
          setShowAgreement(false);
        }}
      >
        <div className="flex flex-col gap-4 p-4">
          <h2 className="text-2xl">LIABILITY WAIVER AND RACE AGREEMENT: </h2>
          <p>
            <span className="ml-10"></span>I attest that I am physically and
            mentally fit to participate in the Hataw Takbo, Bataan ({eventName})
            and have full knowledge of and assume all the risks associated with
            my decision to voluntarily participate in the said event.
          </p>
          <p>
            <span className="ml-10"></span>I also understand and accept that
            during the event, the medical assistance available to me is limited
            to first aid treatment. I am aware and agree that medical expenses
            for injuries or medical treatment incurred at the event are my sole
            responsibility as a participant.
          </p>
          <p>
            <span className="ml-10"></span>I give my permission for the free use
            of my names, photos and voice in any broadcast, telecast, digital,
            print material or any other material in any medium for this event.
          </p>
          <p>
            <span className="ml-10"></span>In consideration of being permitted
            to participate, I do hereby waive and release forever, any and all
            rights to claims and damages I may have against the race organizers,
            sponsors, volunteers, race officials, and all parties involved with
            this event, arising from any and all liability for injury, death or
            damages or any other claims, demands, losses or damages incurred by
            me in connection with my participation in this event.
          </p>
          <p>
            <span className="ml-10"></span>I agree to abide by any decision of
            the race official relative to any aspect of my participation in this
            event. I attest that I have read the rules of the race, understood
            it and agree to abide by them. Participants Signature:
            _____________________ (parents must sign if participant is below 18
            years old) In case of emergency, contact:{" "}
            <span className="underline">
              {watch("emergencyContact")
                ? watch("emergencyContact")
                : "_____________________"}
            </span>{" "}
            Contact No.:{" "}
            <span className="underline">
              {watch("emergencyContactNumber")
                ? watch("emergencyContactNumber")
                : "_____________________"}
            </span>
          </p>

          <button
            onClick={() => {
              setAcceptAgreement(true);
              setShowAgreement(false);
            }}
            className="col-span-2 rounded-md border-2 bg-[#0062ad] p-2 text-white hover:bg-[#0d6cb5]"
          >
            Accept Race Agreement
          </button>
        </div>
      </Modal>

      <button
        type="button"
        onClick={() => {
          setShowAgreement(true);
        }}
        className="col-span-2 cursor-pointer rounded-md border-2 border-sky-300 py-2"
      >
        LIABILITY WAIVER AND RACE AGREEMENT
      </button>

      <button
        type="submit"
        disabled={!acceptAgreement}
        className={`col-span-2 rounded-md border-2 bg-[#0062ad] p-2 text-white hover:bg-[#0d6cb5] disabled:opacity-60`}
      >
        Submit
      </button>
    </form>
  );
};

export default RegistrationForm;
