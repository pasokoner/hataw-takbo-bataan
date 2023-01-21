import { type NextPage } from "next";
import { useState, type ChangeEvent, useEffect, useRef } from "react";
import Scanner from "../../../components/Scanner";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import Title from "../../../components/Title";
import Snackbar from "../../../components/Snackbar";
import { type Event } from "@prisma/client";
import ManualScanner from "../../../components/ManualScanner";
import { useLocalStorage } from "usehooks-ts";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";
import { SlReload } from "react-icons/sl";

import { v4 as uuidv4 } from "uuid";
// import SuccessSound from "../../../assets/sounds/success.mp3";
// import useSound from "use-sound";

type ManualRecord = {
  id: string;
  registrationNumber: number;
  distance: number;
  timeFinished: Date;
  status: "success" | "error" | "loading" | "standby";
  eventId: string;
};

type ScanRecord = {
  kilometerId: string;
  status: "success" | "error" | "loading" | "standby";
  timeFinished: Date;
  id: string;
};

type SavedRecord = Partial<ManualRecord & ScanRecord>;

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

  const { mutate, isLoading: scanLoading } = api.participant.check.useMutation({
    onError: (e) => {
      if (e.message === "This participant already has a record") {
        setErrorMessage(e.message);
      } else if (
        e.message ===
        "An operation failed because it depends on one or more records that were required but not found. Record to update not found."
      ) {
      }

      setSavedRecords((prevState) => {
        const errorRecord = prevState.find(({ id }) => id === purgeId);

        if (errorRecord) {
          setErrorRecords((prevState) => [
            ...prevState,
            { ...errorRecord, status: "error" },
          ]);
        }

        return prevState.filter(({ id }) => id !== purgeId);
      });

      setErrorMessage("Participant not found");
      setShowMessage(true);

      setOngoingRequest(uuidv4());
    },
    onSuccess: () => {
      setSuccessMessage("Participant successfully added!");
      setShowMessage(true);

      setSavedRecords((prevState) =>
        prevState.filter(({ id }) => id !== purgeId)
      );

      setOngoingRequest(uuidv4());
    },
  });

  const { mutate: manualCheck, isLoading: manualLoading } =
    api.participant.manualCheck.useMutation({
      onError: (e) => {
        console.log(e.message);
        if (e.message === "This participant already has a record") {
          setErrorMessage(e.message);
        } else if (
          e.message ===
          "An operation failed because it depends on one or more records that were required but not found. Record to update not found."
        ) {
        }

        setSavedRecords((prevState) => {
          const errorRecord = prevState.find(({ id }) => id === purgeId);

          if (errorRecord) {
            setErrorRecords((prevState) => [
              ...prevState,
              { ...errorRecord, status: "error" },
            ]);
          }

          return prevState.filter(({ id }) => id !== purgeId);
        });
        setErrorMessage("Participant not found");
        setShowMessage(true);
        setOngoingRequest(uuidv4());
      },
      onSuccess: () => {
        setSuccessMessage("Participant successfully added!");
        setShowMessage(true);

        setSavedRecords((prevState) =>
          prevState.filter(({ id }) => id !== purgeId)
        );

        setOngoingRequest(uuidv4());
      },
    });

  // const [scanRecords, setScanRecords] = useLocalStorage<ScanRecord[]>(
  //   "scan-records",
  //   []
  // );

  // const [manualRecords, setManualRecords] = useLocalStorage<ManualRecord[]>(
  //   "manual-records",
  //   []
  // );

  const [savedRecords, setSavedRecords] = useLocalStorage<SavedRecord[]>(
    "saved-records",
    []
  );

  const [errorRecords, setErrorRecords] = useLocalStorage<SavedRecord[]>(
    "error-records",
    []
  );

  const [cameraPassword, setCameraPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const [ongoingRequest, setOngoingRequest] = useState("");
  const [purgeId, setPurgeId] = useState("");

  const updateParticipant = (cameraResult: string, timeFinished: Date) => {
    const cameraResultF = cameraResult.split("-");

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
      // mutate({ kilometerId: cameraResultF[1], timeFinished });
      setSavedRecords([
        ...savedRecords,
        {
          kilometerId: cameraResultF[1],
          status: "standby",
          timeFinished,
          id: uuidv4(),
        },
      ]);
      setOngoingRequest(uuidv4());
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
      // mutate({ kilometerId: cameraResultF[1], timeFinished });
      setSavedRecords([
        ...savedRecords,
        {
          kilometerId: cameraResultF[1],
          status: "standby",
          timeFinished,
          id: uuidv4(),
        },
      ]);
      setOngoingRequest(uuidv4());
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
      // mutate({ kilometerId: cameraResultF[1], timeFinished });
      setSavedRecords([
        ...savedRecords,
        {
          kilometerId: cameraResultF[1],
          status: "standby",
          timeFinished,
          id: uuidv4(),
        },
      ]);
      setOngoingRequest(uuidv4());
    }
  };

  const manualUpdate = (
    query: string,
    timeFinished: Date,
    eventData: Event
  ) => {
    const queryF = query.split("-");

    if (queryF[0] === "3" && queryF[1] && eventData?.timeStart3km) {
      if (eventData.raceFinished3km) {
        setErrorMessage("This lane is already finished");
        setShowMessage(true);
        return;
      }
      // manualCheck({
      //   participantId: parseInt(queryF[1]),
      //   distance: parseInt(queryF[0]),
      //   timeFinished,
      //   eventId: eventData.id,
      // });
      setSavedRecords([
        ...savedRecords,
        {
          registrationNumber: parseInt(queryF[1]),
          distance: parseInt(queryF[0]),
          timeFinished,
          eventId: eventData.id,
          status: "standby",
          id: uuidv4(),
        },
      ]);
      setOngoingRequest(uuidv4());
    } else if (queryF[0] === "5" && queryF[1] && eventData?.timeStart5km) {
      if (eventData.raceFinished5km) {
        setErrorMessage("This lane is already finished");
        setShowMessage(true);
        return;
      }
      // manualCheck({
      //   participantId: parseInt(queryF[1]),
      //   distance: parseInt(queryF[0]),
      //   timeFinished,
      //   eventId: eventData.id,
      // });

      setSavedRecords([
        ...savedRecords,
        {
          registrationNumber: parseInt(queryF[1]),
          distance: parseInt(queryF[0]),
          timeFinished,
          eventId: eventData.id,
          id: uuidv4(),
          status: "standby",
        },
      ]);
      setOngoingRequest(uuidv4());
    } else if (queryF[0] === "10" && queryF[1] && eventData?.timeStart10km) {
      if (eventData.raceFinished10km) {
        setErrorMessage("This lane is already finished");
        setShowMessage(true);
        return;
      }
      // manualCheck({
      //   participantId: parseInt(queryF[1]),
      //   distance: parseInt(queryF[0]),
      //   timeFinished,
      //   eventId: eventData.id,
      // });
      setSavedRecords([
        ...savedRecords,
        {
          registrationNumber: parseInt(queryF[1]),
          distance: parseInt(queryF[0]),
          timeFinished,
          eventId: eventData.id,
          id: uuidv4(),
          status: "standby",
        },
      ]);
      setOngoingRequest(uuidv4());
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

  useEffect(() => {
    if (savedRecords.length !== 0) {
      if (
        savedRecords[0] &&
        savedRecords[0].distance &&
        savedRecords[0].status !== "error"
      ) {
        const data = savedRecords[0] as ManualRecord;
        setPurgeId(data.id);
        manualCheck({
          timeFinished: new Date(data.timeFinished),
          eventId: data.eventId,
          distance: data.distance,
          registrationNumber: data.registrationNumber,
        });
      } else {
        const data = savedRecords[0] as ScanRecord;
        setPurgeId(data.id);
        mutate({
          timeFinished: new Date(data.timeFinished),
          kilometerId: data.kilometerId,
        });
      }
    }
  }, [ongoingRequest]);

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

  console.log(errorRecords);

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

      {savedRecords &&
        savedRecords.map(
          ({ kilometerId, timeFinished, id, registrationNumber }) => {
            return (
              <div
                key={id}
                className="mt-4 grid w-full grid-cols-4 border-b-2 border-black pb-2 text-sm"
              >
                <p className="col-span-3">
                  <span className="font-semibold">Participant ID: </span>
                  {kilometerId ? kilometerId : registrationNumber}
                </p>
                <div className="col-span-1 row-span-2 ml-auto mr-2 flex flex-col items-center justify-center">
                  <IoClose
                    className="cursor-pointer text-2xl hover:text-slate-600"
                    onClick={() => {
                      setSavedRecords((prevState) =>
                        prevState.filter(({ id: idC }) => id !== idC)
                      );
                      setOngoingRequest(uuidv4());
                    }}
                  />
                </div>
                <p className="col-span-3">
                  <span className="font-semibold">Finished Time: </span>
                  {dayjs(timeFinished).format("hh")}
                  {" : "}
                  {dayjs(timeFinished).format("mm")}
                  {" : "}
                  {dayjs(timeFinished).format("ss")}{" "}
                  {dayjs(timeFinished).format("A")}
                </p>
              </div>
            );
          }
        )}

      {errorRecords &&
        errorRecords.map((record) => {
          const { registrationNumber, timeFinished, id, status, kilometerId } =
            record;
          const errorStyle = "border-red-400 bg-red-100 px-4 py-3 text-red-700";

          return (
            <div
              key={id}
              className={`${
                status === "error" ? errorStyle : ""
              } mt-4 grid w-full grid-cols-4 border-b-2 border-black pb-2 text-sm`}
            >
              <p className="col-span-3">
                <span className="font-semibold">Participant ID: </span>
                {kilometerId ? kilometerId : registrationNumber}
              </p>
              <div className="col-span-1 row-span-2 ml-auto mr-2 flex items-center justify-center gap-3">
                <SlReload
                  className="cursor-pointer text-2xl hover:text-slate-600"
                  onClick={() => {
                    setErrorRecords((prevState) =>
                      prevState.filter(({ id: idC }) => record.id !== idC)
                    );
                    setSavedRecords((prevState) => [...prevState, record]);
                    setOngoingRequest(uuidv4());
                  }}
                />
                <IoClose
                  className="cursor-pointer text-2xl hover:text-slate-600"
                  onClick={() => {
                    setErrorRecords(
                      errorRecords.filter(({ id: idC }) => record.id !== idC)
                    );
                    // setSavedRecords((prevState) => [...prevState, record]);
                    // setOngoingRequest(uuidv4());
                  }}
                />
              </div>
              <p className="col-span-3">
                <span className="font-semibold">Finished Time: </span>
                {dayjs(timeFinished).format("hh")}
                {" : "}
                {dayjs(timeFinished).format("mm")}
                {" : "}
                {dayjs(timeFinished).format("ss")}{" "}
                {dayjs(timeFinished).format("A")}
              </p>
            </div>
          );
        })}

      <div className="py-4"></div>

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
