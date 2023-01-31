import { useRef, useState } from "react";

import { Gender, Municipality, ShirtSize } from "@prisma/client";
import { type z } from "zod";
import { type participantSchema } from "../server/api/routers/participantBataan";

import { useForm, type SubmitHandler } from "react-hook-form";

import dayjs from "dayjs";

import html2canvas from "html2canvas";

import { api } from "../utils/api";

import { distances } from "../utils/constant";

import { RiLoader5Fill } from "react-icons/ri";
import { AiOutlineCopy } from "react-icons/ai";

import Modal from "./Modal";
import QrMaker from "./QrMaker";

type Props = {
  eventId: string;
  eventName: string;
};

type ParticipantBataan = z.infer<typeof participantSchema>;

type ParticipantOutsideBataan = Omit<ParticipantBataan, "municipality">;

const RegistrationForm = ({ eventId, eventName }: Props) => {
  const [error, setError] = useState("");

  const { mutate, isLoading } = api.participant.register.useMutation({
    onSuccess: (data) => {
      setSelectedOptions([]);
      setErrorOptions("");
      setError("");
      reset();
      setDetails({
        id: data?.id,
        registrationNumber: data?.registrationNumber,
      });
      setShowDetails(true);
    },

    onError: (error) => {
      if (error.message.includes("constraint")) {
        setError("Seems like you are already registered");
      } else {
        setError("Seems like there is an error - Sorry for inconvenience");
      }
    },
  });

  const { register, handleSubmit, watch, reset } = useForm<
    ParticipantBataan | ParticipantOutsideBataan
  >();

  const onSubmit: SubmitHandler<
    ParticipantBataan | ParticipantOutsideBataan
  > = (data) => {
    if (selectedOptions.length === 0) {
      setErrorOptions("Pick atleast one option");
      if (firstCheckbox && firstCheckbox.current) firstCheckbox.current.focus();
      return;
    }

    if (data) {
      const { address, firstName, lastName, emergencyContact, email } = data;
      mutate({
        ...data,
        birthdate: dayjs(data.birthdate).toDate(),
        eventId: eventId,
        distances: selectedOptions,
        address: address.trim().toUpperCase(),
        firstName: firstName.trim().toUpperCase(),
        lastName: lastName.trim().toUpperCase(),
        emergencyContact: emergencyContact.trim().toUpperCase(),
        email: email?.trim().toLowerCase(),
      });
    }
  };

  const [outsideBataan, setOutsideBataan] = useState(false);
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [details, setDetails] = useState<{
    registrationNumber: number;
    id: string;
  } | null>();
  const [showAgreement, setShowAgreement] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [errorOptions, setErrorOptions] = useState("");
  const firstCheckbox = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    if (event.target.checked) {
      // setSelectedOptions([...selectedOptions, parseInt(value)]);
      setSelectedOptions([parseInt(value)]);
    } else {
      setSelectedOptions(
        selectedOptions.filter((option) => option !== parseInt(value))
      );
    }
  };

  const handleToggleAddress = () => {
    setOutsideBataan((prevState) => !prevState);
  };

  const handleDownloadImage = async () => {
    const element = qrRef.current;
    const canvas = await html2canvas(element as HTMLDivElement);

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const toggleClass = " transform translate-x-6 bg-blue-600";

  return (
    /* eslint-disable @typescript-eslint/no-misused-promises */
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
      {/* [&>*]:flex [&>*]:flex-col [&>*]:gap-2 */}

      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          required
          {...register("firstName")}
          className="uppercase"
        />
      </div>
      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          required
          {...register("lastName")}
          className="uppercase"
        />
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
        <input
          type="text"
          id="email"
          pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          title={`Please include an '@' in the email address.`}
          {...register("email")}
          className="uppercase"
        />
      </div>
      <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
        <label htmlFor="contactNumber">Contact Number</label>
        <input
          type="text"
          id="contactNumber"
          placeholder="09XXXXXXXXX"
          pattern="^(09)[0-9]{9}$"
          required
          {...register("contactNumber")}
        />
      </div>

      <div className="col-span-2 border-b-2 py-2"></div>

      {/*   Switch Container */}
      <div className="col-span-2 flex items-center gap-4">
        <p>Outside Bataan:</p>
        <div
          className="h-5 w-12 cursor-pointer items-center rounded-full bg-gray-400 p-1 md:h-7 md:w-14"
          onClick={handleToggleAddress}
        >
          {/* Switch */}
          <div
            className={
              `mr-auto h-3 w-5 transform rounded-full bg-slate-600 shadow-md duration-300 ease-in-out md:h-5 md:w-6` +
              `${outsideBataan ? toggleClass : ""}`
            }
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

      {/* <div className="col-span-2 flex flex-col gap-2">
        <label htmlFor="kilometer">Kilometer/s</label>
        <select id="kilometer" required {...register("kilometer")}>
          <option value={""}>Choose...</option>
          {Object.keys(Kilometer).map((kilometer) => (
            <option key={kilometer} value={kilometer}>
              {kilometer}
            </option>
          ))}
        </select>
      </div> */}
      <div className="col-span-2 flex flex-col gap-2">
        <h2>Kilometer</h2>
        <div className="flex flex-wrap gap-4">
          {distances.map((option) => {
            return (
              <div className="flex items-center" key={option.value}>
                <input
                  id={option.label}
                  type="checkbox"
                  value={option.value}
                  ref={firstCheckbox}
                  checked={selectedOptions.some(
                    (selectedOption) => selectedOption === option.value
                  )}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor={option.label}
                  className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500"
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>

        {errorOptions && (
          <div className="text-sm text-red-600">{errorOptions}</div>
        )}
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

      <div className="col-span-2 flex flex-col gap-2">
        <label htmlFor="emergencyContact">In case of emergency, contact</label>
        <input
          type="text"
          id="emergencyContact"
          required
          {...register("emergencyContact")}
          className="uppercase"
        />
      </div>

      <div className="col-span-2 flex flex-col gap-2">
        <label htmlFor="emergencyContactNumber">Contact Number</label>
        <input
          type="text"
          id="emergencyContactNumber"
          placeholder="09XXXXXXXXX"
          pattern="^(09)[0-9]{9}$"
          required
          {...register("emergencyContactNumber")}
        />
      </div>

      <Modal
        title="LIABILITY WAIVER AND RACE AGREEMENT"
        show={showAgreement}
        onClose={() => {
          setShowAgreement(false);
        }}
      >
        <div className="flex flex-col gap-4 p-4 text-sm md:text-lg">
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
            it and agree to abide by them.
          </p>
          <p>
            Participants Signature: _____________________ (parents must sign if
            participant is below 18 years old)
          </p>
          <p>
            In case of emergency, contact:{" "}
            <span className="underline">
              {watch("emergencyContact")
                ? watch("emergencyContact")
                : "_____________________"}
            </span>{" "}
          </p>
          <p>
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

      <Modal
        title="Registration Success!"
        onClose={() => {
          setShowDetails(false);
          setDetails(null);
        }}
        show={showDetails}
      >
        <div className="rounded border border-slate-400 bg-slate-100 px-4 py-3 text-slate-700">
          <h4 className="mb-2 text-xl">
            Registration No.{" "}
            <span className="font-semibold">{details?.registrationNumber}</span>{" "}
          </h4>
          <div className="flex flex-col sm:flex-row">
            <div className="mb-2 flex flex-col items-center justify-center sm:mr-4">
              <div className="w-28">
                <div ref={qrRef} className="flex justify-center p-1">
                  <QrMaker value={details?.id as string} size={10} />
                </div>
                <button
                  onClick={async () => {
                    await handleDownloadImage();
                  }}
                  className="mt-2 w-full rounded-md border-2 border-slate-500 py-1 hover:border-slate-400 hover:text-slate-400"
                >
                  SAVE <AiOutlineCopy className="inline" />
                </button>
              </div>
            </div>
            <p className="">
              ** Please remember your{" "}
              <span className="text-red-400 underline">Registration No. </span>{" "}
              and take a screenshot of{" "}
              <span className="text-red-400 underline">this QR code</span> and
              use it as your identification when claiming your certification. It
              serves as a unique identifier and is required to verify your
              eligibility. You can also use it to view and edit your
              registration details. **
            </p>
          </div>
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

      {error && <div className="text-sm text-red-600">{error}</div>}

      {!isLoading && (
        <button
          type="submit"
          disabled={!acceptAgreement}
          className={`col-span-2 rounded-md border-2 bg-[#0062ad] p-2 text-white hover:bg-[#0d6cb5] disabled:opacity-60`}
        >
          Submit
        </button>
      )}
      {isLoading && (
        <button
          disabled
          className={`col-span-2 flex justify-center rounded-md border-2 bg-[#0062ad] p-2 text-white hover:bg-[#0d6cb5] disabled:opacity-60`}
        >
          <RiLoader5Fill className="animate-spin text-center text-2xl" />
        </button>
      )}
    </form>
  );
};

export default RegistrationForm;
