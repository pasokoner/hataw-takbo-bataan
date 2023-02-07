import * as XLSX from "xlsx";
import { api } from "../utils/api";
import { useEffect, useState } from "react";
import { type Event } from "@prisma/client";

type Props = {
  distance: number;
  eventId: string;
  eventData: Event | null | undefined;
};

const ExportFinisher = ({ distance, eventId, eventData }: Props) => {
  const [enableFetch, setEnableFetch] = useState(false);

  const { data } = api.km.getFinishers.useQuery(
    { distance, eventId },
    { enabled: enableFetch }
  );

  const convertDownload = () => {
    setEnableFetch(true);
  };

  useEffect(() => {
    if (enableFetch === true && data) {
      let timeStart: Date | null | undefined = null;

      if (distance === 3) {
        timeStart = eventData?.timeStart3km;
      }

      if (distance === 5) {
        timeStart = eventData?.timeStart5km;
      }

      if (distance === 10) {
        timeStart = eventData?.timeStart10km;
      }

      const dataFormatted = data?.map(
        ({ registrationNumber, participant, timeFinished }) => {
          const time = timeStart
            ? `${Math.floor(
                ((timeFinished as Date).getTime() - timeStart.getTime()) /
                  (1000 * 60 * 60)
              )
                .toFixed(0)
                .toString()}:${Math.floor(
                (((timeFinished as Date).getTime() - timeStart.getTime()) /
                  1000 /
                  60) %
                  60
              )
                .toFixed(0)
                .toString()
                .padStart(2, "0")}:${Math.floor(
                (((timeFinished as Date).getTime() - timeStart.getTime()) /
                  1000) %
                  60
              )
                .toFixed(0)
                .toString()
                .padStart(2, "0")}`
            : "00:00:00";

          return {
            registrationNumber,
            firstName: participant.firstName,
            lastName: participant.lastName,
            time: time,
          };
        }
      );
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataFormatted);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${distance}KM-FINISHERS.xlsx`;
      link.click();
      setEnableFetch(false);
    }
  }, [data]);

  return (
    <button
      className="ml-auto rounded-sm border-2 bg-emerald-400 py-1 px-2 text-xl font-semibold text-white"
      onClick={() => {
        convertDownload();
      }}
    >
      EXPORT
    </button>
  );
};

export default ExportFinisher;
