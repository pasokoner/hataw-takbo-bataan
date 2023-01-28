import React, { useState, useRef } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import ScreenContainer from "../../../layouts/ScreenContainer";
import Title from "../../../components/Title";
import { api } from "../../../utils/api";

import * as XLSX from "xlsx";
import { useLocalStorage } from "usehooks-ts";

const Finished: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  // const [finishers, setFinishers] = useState();
  const [distance, setDistance] = useState(10);
  const tableRef = useRef<HTMLTableElement>(null);
  const [cameraPassword, setCameraPassword] = useLocalStorage(
    "camera-password",
    ""
  );

  const { data: finishers } = api.participant.getFinisher.useQuery({
    eventId: eventId as string,
    distance: distance,
  });

  const { data: eventData, isLoading: eventLoading } =
    api.event.details.useQuery(
      {
        eventId: eventId as string,
        includeKM: false,
      },
      {
        refetchOnWindowFocus: false,
        refetchInterval: 60000,
      }
    );

  const exportToExcel = () => {
    if (!tableRef.current) return;
    const table = tableRef.current;
    const data: any[] = [];
    //Get the rows of the table
    const rows = table.getElementsByTagName("tr");
    //Get the headers of the table

    const headers = rows[0]!.getElementsByTagName("th");
    //Iterate through rows
    for (let i = 1; i < rows.length; i++) {
      const rowData = {};
      const cells = rows[i]!.getElementsByTagName("td");
      //Iterate through cells
      for (let j = 0; j < cells.length; j++) {
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        //@ts-ignore
        rowData[headers[j].textContent] = cells[j].textContent;
      }
      data.push(rowData);
    }
    //Convert the data to a workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${distance}KM-finishers.xlsx`);
  };

  if (eventLoading) {
    return <></>;
  }

  if (!eventData) {
    return (
      <ScreenContainer className="mx-auto px-8 py-6 md:px-16">
        <div className="mx-auto pt-20">
          <p className="text-3xl">Event not found!</p>
        </div>
      </ScreenContainer>
    );
  }

  if (cameraPassword !== eventData.cameraPassword) {
    return (
      <ScreenContainer className="mx-auto px-8 py-6 md:px-16">
        <Title value={`HATAW BATAAN TAKBO - ${eventData.name}`} />
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <label htmlFor="cameraPassword">FINISHERS PASSWORD</label>
          <input
            type="text"
            id="cameraPassword"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setCameraPassword(e.target.value);
            }}
          />
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="mx-auto px-8 py-6 md:px-16">
      <div className="mb-2 grid grid-cols-6 gap-2">
        <button
          onClick={() => setDistance(3)}
          className="col-span-3 flex items-center justify-center rounded-sm border-2 border-black bg-km3 py-2 font-bold text-white hover:bg-opacity-95 md:col-span-2"
        >
          3 KM
        </button>
        <button
          onClick={() => setDistance(5)}
          className="col-span-3 flex items-center justify-center rounded-sm border-2 border-black bg-km5 py-2 font-bold text-white hover:bg-opacity-95 md:col-span-2"
        >
          5 KM
        </button>
        <button
          onClick={() => setDistance(10)}
          className="col-span-6 flex items-center justify-center rounded-sm  border-2 border-black bg-km10 py-2 font-bold text-white hover:bg-opacity-95 md:col-span-2"
        >
          10 KM
        </button>
      </div>

      <Title value={`${distance} KM FINISHERS`} />
      <div className="flex w-full">
        <div className="flex items-center justify-center rounded-sm border-2 bg-black py-1 px-2 text-2xl font-semibold text-white">
          FINISHERS: {finishers ? finishers.length : 0}
        </div>
        <button
          onClick={exportToExcel}
          className="ml-auto rounded-sm border-2 bg-emerald-400 py-1 px-2 text-xl font-semibold text-white"
        >
          EXPORT
        </button>
      </div>
      <table className="w-full" ref={tableRef}>
        <thead className="w-full">
          <tr className="grid grid-cols-6 rounded-t-md bg-primary-hover text-white">
            <th className="col-span-1 py-1">RANKING</th>
            <th className="col-span-3 py-1">NAME</th>
            <th className="col-span-2 py-1">TIME</th>
          </tr>
        </thead>
        <tbody>
          {finishers &&
            finishers.map(
              (
                { id, timeFinished, registrationNumber, participant },
                index
              ) => {
                let timeStart: Date | null = null;

                if (distance === 3) {
                  timeStart = eventData.timeStart3km;
                }

                if (distance === 5) {
                  timeStart = eventData.timeStart5km;
                }

                if (distance === 10) {
                  timeStart = eventData.timeStart10km;
                }

                const time = timeStart
                  ? `${Math.floor(
                      ((timeFinished as Date).getTime() - timeStart.getTime()) /
                        (1000 * 60 * 60)
                    )
                      .toFixed(0)
                      .toString()}:${(
                      (((timeFinished as Date).getTime() -
                        timeStart.getTime()) /
                        1000 /
                        60) %
                      60
                    )
                      .toFixed(0)
                      .toString()
                      .padStart(2, "0")}:${(
                      (((timeFinished as Date).getTime() -
                        timeStart.getTime()) /
                        1000) %
                      60
                    )
                      .toFixed(0)
                      .toString()
                      .padStart(2, "0")}`
                  : "00:00:00";

                const rankers = index < 10 ? " bg-yellow-400 font-medium" : "";

                return (
                  <tr
                    key={id}
                    className={
                      "grid grid-cols-6 border-2 border-r-2 border-solid text-xs md:text-lg" +
                      rankers
                    }
                  >
                    <td className="col-span-1 flex items-center justify-between border-r-2 p-2 ">
                      {index + 1}
                    </td>
                    <td className="col-span-3 flex items-center justify-between border-r-2 p-2">
                      {registrationNumber} - {participant.firstName}{" "}
                      {participant.lastName}
                    </td>
                    <td className="col-span-2 flex items-center justify-between p-2 ">
                      {time}
                    </td>
                  </tr>
                );
              }
            )}
        </tbody>
      </table>
    </ScreenContainer>
  );
};

export default Finished;
