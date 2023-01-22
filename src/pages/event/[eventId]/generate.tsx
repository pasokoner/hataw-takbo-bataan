import { type NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";

import { useState, useEffect, useRef } from "react";

import QrMaker from "../../../components/QrMaker";

import html2canvas from "html2canvas";

import BidsLogo from "../../../assets/bids-logo.png";
import { api } from "../../../utils/api";
import { Kilometer } from "@prisma/client";

const Generate: NextPage = () => {
  const { query } = useRouter();
  const { eventId } = query;

  const { data: bibData, isLoading } = api.km.getAll.useQuery(
    {
      eventId: eventId as string,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const bibRef = useRef<HTMLDivElement>(null);
  const [printStart, setPrintStart] = useState(0);
  const [bibCanvas, setBibCanvas] = useState<Kilometer>();

  const handleDownloadImage = async (registrationNumber?: number) => {
    const element = bibRef.current;
    const canvas = await html2canvas(element as HTMLDivElement, {
      scale: 8,
    });

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = `${registrationNumber ? registrationNumber : 0}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  useEffect(() => {
    if (bibCanvas) {
      /* eslint-disable @typescript-eslint/no-floating-promises */
      handleDownloadImage(bibCanvas?.registrationNumber as number);
    }
    if (bibData && printStart < bibData.length) {
      setBibCanvas(bibData[printStart]);
      setPrintStart((prevState) => prevState + 1);
    }
  }, [bibData, printStart]);

  if (isLoading) {
    return <></>;
  }

  if (!bibData) {
    return (
      <div className="mx-auto pt-6 md:pt-12">
        <p className="text-3xl">Event not found!</p>
      </div>
    );
  }

  let bibColor = "";
  let bibNumber = "0000";

  if (bibCanvas && bibCanvas.registrationNumber && bibCanvas.distance === 3) {
    bibColor = "bg-km3";
    bibNumber =
      "30" +
      bibNumber.slice(0, bibCanvas.registrationNumber.toString().length) +
      bibCanvas.registrationNumber.toString();
  } else if (
    bibCanvas &&
    bibCanvas.registrationNumber &&
    bibCanvas.distance === 5
  ) {
    bibColor = "bg-km5";
    bibNumber =
      "50" +
      bibNumber.slice(0, bibCanvas.registrationNumber.toString().length) +
      bibCanvas.registrationNumber.toString();
  } else if (
    bibCanvas &&
    bibCanvas.registrationNumber &&
    bibCanvas.distance === 10
  ) {
    bibColor = "bg-km10";
    bibNumber =
      "10" +
      bibNumber.slice(0, bibCanvas.registrationNumber.toString().length) +
      bibCanvas.registrationNumber.toString();
  }

  return (
    <div
      ref={bibRef}
      className={
        `mx-auto grid h-[310px] w-[439px] grid-rows-5 border-2 border-solid border-black font-roboto text-white ` +
        bibColor
      }
    >
      <div className="row-span-1 flex w-full justify-center bg-white">
        <Image src={BidsLogo} alt="bids-logo" className="w-10/12" />
      </div>

      <div className="row-span-3 grid grid-rows-6">
        <p className="row-span-4 text-center text-8xl font-bold">{bibNumber}</p>
        <p className="row-span-2 text-center font-semibold">10KM</p>
      </div>

      <div className="row-span-1 grid grid-cols-5 border-t-2 border-solid border-black">
        <div className="col-span-1 flex h-full flex-col items-center justify-center border-r-2 border-solid border-black">
          <div className="text-[.5rem]">BAGGAGE</div>
          <div className="text-sm font-semibold">{bibNumber}</div>
        </div>
        <div className="col-span-1 flex h-full flex-col items-center justify-center border-r-2 border-solid border-black">
          <div className="text-[.5rem]">RAFFLE</div>
          <div className="text-sm font-semibold">{bibNumber}</div>
        </div>
        <div className="col-span-1 flex h-full flex-col items-center justify-center border-r-2 border-solid border-black">
          <div className="text-[.5rem]">FINISHER&#39;S KIT</div>
          <div className="text-sm font-semibold">{bibNumber}</div>
        </div>
        <div className="col-span-1 flex h-full flex-col items-center justify-center border-r-2 border-solid border-black">
          <div className="text-[.5rem]">BAGGAGE</div>
          <div className="text-sm font-semibold">{bibNumber}</div>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="bg-white p-1">
            <QrMaker
              value={`${bibCanvas?.distance.toString() ?? ""}-${
                bibCanvas?.id ?? ""
              }`}
              size={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;

import { getSession } from "next-auth/react";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (session.user?.role !== "ADMIN") {
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
