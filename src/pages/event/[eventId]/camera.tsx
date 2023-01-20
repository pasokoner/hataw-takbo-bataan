import { type NextPage } from "next";
import { useState, type ChangeEvent, useEffect, useRef } from "react";
import Scanner from "../../../components/Scanner";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import Title from "../../../components/Title";
import Snackbar from "../../../components/Snackbar";
import { type Event } from "@prisma/client";
import ManualScanner from "../../../components/ManualScanner";

// import SuccessSound from "../../../assets/sounds/success.mp3";
import useSound from "use-sound";

const Camera: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const {
    data: eventData,
    isLoading,
    refetch,
  } = api.event.details.useQuery(
    {
      eventId: eventId as string,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const { mutate } = api.participant.check.useMutation({
    onError: (e) => {
      console.log(e.message);
      if (e.message === "This participant already has a record") {
        setErrorMessage(e.message);
      } else if (
        e.message ===
        "An operation failed because it depends on one or more records that were required but not found. Record to update not found."
      ) {
        setErrorMessage("Participant not found");
      }
      setShowMessage(true);
    },
    onSuccess: () => {
      setSuccessMessage("Participant successfully added!");
      setShowMessage(true);
    },
  });

  const { mutate: manualCheck } = api.participant.manualCheck.useMutation({
    onError: (e) => {
      console.log(e.message);
      if (e.message === "This participant already has a record") {
        setErrorMessage(e.message);
      } else if (
        e.message ===
        "An operation failed because it depends on one or more records that were required but not found. Record to update not found."
      ) {
        setErrorMessage("Participant not found");
      }
      setShowMessage(true);
    },
    onSuccess: () => {
      setSuccessMessage("Participant successfully added!");
      setShowMessage(true);
    },
  });

  const [cameraPassword, setCameraPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const updateParticipant = (cameraResult: string, timeFinished: Date) => {
    const cameraResultF = cameraResult.split("+");

    if (
      cameraResultF[0] === "3" &&
      cameraResultF[1] &&
      eventData?.timeStart3km
    ) {
      if (eventData.raceFinished3km) {
        setErrorMessage("This lane is already finished");
        setShowMessage(true);
        return;
      }
      mutate({ kilometerId: cameraResultF[1], timeFinished });
    } else if (
      cameraResultF[0] === "5" &&
      cameraResultF[1] &&
      eventData?.timeStart5km
    ) {
      if (eventData.raceFinished5km) {
        setErrorMessage("This lane is already finished");
        setShowMessage(true);
        return;
      }
      mutate({ kilometerId: cameraResultF[1], timeFinished });
    } else if (
      cameraResultF[0] === "10" &&
      cameraResultF[1] &&
      eventData?.timeStart10km
    ) {
      if (eventData.raceFinished10km) {
        setErrorMessage("This lane is already finished");
        setShowMessage(true);
        return;
      }
      mutate({ kilometerId: cameraResultF[1], timeFinished });
    }
  };

  const manualUpdate = (
    query: string,
    timeFinished: Date,
    eventData: Event
  ) => {
    const queryF = query.split("+");

    if (queryF[0] === "3" && queryF[1] && eventData?.timeStart3km) {
      if (eventData.raceFinished3km) {
        setErrorMessage("This lane is already finished");
        setShowMessage(true);
        return;
      }
      manualCheck({
        participantId: parseInt(queryF[1]),
        distance: parseInt(queryF[0]),
        timeFinished,
        eventId: eventData.id,
      });
    } else if (queryF[0] === "5" && queryF[1] && eventData?.timeStart5km) {
      if (eventData.raceFinished5km) {
        setErrorMessage("This lane is already finished");
        setShowMessage(true);
        return;
      }
      manualCheck({
        participantId: parseInt(queryF[1]),
        distance: parseInt(queryF[0]),
        timeFinished,
        eventId: eventData.id,
      });
    } else if (queryF[0] === "10" && queryF[1] && eventData?.timeStart10km) {
      if (eventData.raceFinished10km) {
        setErrorMessage("This lane is already finished");
        setShowMessage(true);
        return;
      }
      manualCheck({
        participantId: parseInt(queryF[1]),
        distance: parseInt(queryF[0]),
        timeFinished,
        eventId: eventData.id,
      });
    }
  };

  const closeSnackbar = () => {
    setShowMessage(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      /*eslint-disable @typescript-eslint/no-floating-promises*/
      refetch();
    }, 7000);
    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowMessage(false);
      setErrorMessage("");
      setSuccessMessage("");
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [showMessage]);

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

  if (cameraPassword !== eventData.cameraPassword) {
    return (
      <div className="pt-6">
        <Title value={`HATAW BATAAN TAKBO - ${eventData.name}`} />
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <label htmlFor="cameraPassword">CAMERA PASSWORD</label>
          <input
            type="text"
            id="cameraPassword"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCameraPassword(e.target.value);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="mb-4 grid grid-cols-6 gap-3">
        <h3 className="col-span-3 font-semibold sm:col-span-2 sm:text-xl">
          <span className="rounded-md bg-km3 p-1 sm:p-2">3KM</span> -{" "}
          {eventData.timeStart3km && eventData.raceFinished3km && "FINISHED"}
          {eventData.timeStart3km && !eventData.raceFinished3km && "ONGOING"}
          {!eventData.timeStart3km && "STANDBY"}
        </h3>
        <h3 className="col-span-3 font-semibold sm:col-span-2 sm:text-xl">
          <span className="rounded-md bg-km5 p-1 text-white sm:p-2">5KM</span> -{" "}
          {eventData.timeStart5km && eventData.raceFinished5km && "FINISHED"}
          {eventData.timeStart5km && !eventData.raceFinished5km && "ONGOING"}
          {!eventData.timeStart5km && "STANDBY"}
        </h3>
        <h3 className="col-span-3 font-semibold sm:col-span-2 sm:text-xl">
          <span className="rounded-md bg-km10 p-1 text-white sm:p-2">10KM</span>{" "}
          -{" "}
          {eventData.timeStart10km && eventData.raceFinished10km && "FINISHED"}
          {eventData.timeStart10km && !eventData.raceFinished10km && "ONGOING"}
          {!eventData.timeStart10km && "STANDBY"}
        </h3>
      </div>

      <Scanner updateParticipant={updateParticipant} />
      <ManualScanner manualUpdate={manualUpdate} eventData={eventData} />
      {showMessage && errorMessage && (
        <Snackbar onClose={closeSnackbar} type="error" message={errorMessage} />
      )}
      {showMessage && successMessage && (
        <Snackbar
          onClose={closeSnackbar}
          type="success"
          message={successMessage}
        />
      )}
    </div>
  );
};

export default Camera;
