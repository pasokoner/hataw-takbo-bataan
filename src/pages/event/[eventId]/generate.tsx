import { type NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";

import { useState, useEffect, useRef } from "react";

import QrMaker from "../../../components/QrMaker";

import html2canvas from "html2canvas";

import BidsLogo from "../../../assets/bids-logo.png";
import OneBataanLogo from "../../../assets/1bataan.png";
import SeekPhorLogo from "../../../assets/seekphor.png";
import HTBLogo from "../../../assets/hataw-takbo-bataan.png";
import HermosaLogo from "../../../assets/hermosa.png";
import BataanSealLogo from "../../../assets/bataan-seal.png";

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
  const [printStart, setPrintStart] = useState(2650);
  const [bibCanvas, setBibCanvas] = useState<Kilometer>();

  const handleDownloadImage = async (registrationNumber?: number) => {
    const element = bibRef.current;
    const canvas = await html2canvas(element as HTMLDivElement, {
      scale: 4,
    });

    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = `${registrationNumber ? registrationNumber : 0}.png`;

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
      handleDownloadImage(bibCanvas.registrationNumber);
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
  let kmColor = "";
  let bibNumber = "00000";

  if (bibCanvas && bibCanvas.registrationNumber && bibCanvas.distance === 3) {
    bibColor = "bg-km3";
    kmColor = "text-km3";
    bibNumber =
      bibNumber.slice(0, 5 - bibCanvas.registrationNumber.toString().length) +
      bibCanvas.registrationNumber.toString();
  } else if (
    bibCanvas &&
    bibCanvas.registrationNumber &&
    bibCanvas.distance === 5
  ) {
    bibColor = "bg-km5";
    kmColor = "text-km5";

    bibNumber =
      bibNumber.slice(0, 5 - bibCanvas.registrationNumber.toString().length) +
      bibCanvas.registrationNumber.toString();
  } else if (
    bibCanvas &&
    bibCanvas.registrationNumber &&
    bibCanvas.distance === 10
  ) {
    bibColor = "bg-[#125CF9]";
    kmColor = "text-[#125CF9]";

    bibNumber =
      bibNumber.slice(0, 5 - bibCanvas.registrationNumber.toString().length) +
      bibCanvas.registrationNumber.toString();
  }

  return (
    <div
      ref={bibRef}
      className={
        `mx-auto h-[375px] w-[525px] font-bebas tracking-[.15em] text-white ` +
        bibColor
      }
    >
      <div className="relative row-span-2 grid h-[35%] w-full grid-cols-5">
        <div className="absolute left-[100px] flex h-[40px] w-3/12 gap-2 opacity-10">
          <Image src={BataanSealLogo} alt="Bataan Seal" className="" />
          <Image src={SeekPhorLogo} alt="Seek Phor" className="" />
          <Image src={HTBLogo} alt="Hataw Takbo Bataan Logo" className="" />
          <Image src={OneBataanLogo} alt="One Bataan Logo" className="" />
          <Image src={HermosaLogo} alt="Hermosa Logo" className="" />
          <Image src={HTBLogo} alt="Hataw Takbo Bataan Logo" className="" />
          <Image src={OneBataanLogo} alt="One Bataan Logo" className="" />
        </div>

        <div className="absolute left-[100px] mt-[45px] flex h-[40px] w-3/12 gap-2 opacity-10">
          <Image src={OneBataanLogo} alt="One Bataan Logo" className="" />
          <Image src={HermosaLogo} alt="Hermosa Logo" className="" />
          <Image src={HTBLogo} alt="Hataw Takbo Bataan Logo" className="" />
          <Image src={OneBataanLogo} alt="One Bataan Logo" className="" />
          <Image src={BataanSealLogo} alt="Bataan Seal" className="" />
          <Image src={SeekPhorLogo} alt="Seek Phor" className="" />
          <Image src={HTBLogo} alt="Hataw Takbo Bataan Logo" className="" />
        </div>

        <div className="absolute left-[100px] mt-[90px] flex h-[40px] w-3/12 gap-2 opacity-10">
          <Image src={BataanSealLogo} alt="Bataan Seal" className="" />
          <Image src={SeekPhorLogo} alt="Seek Phor" className="" />
          <Image src={HTBLogo} alt="Hataw Takbo Bataan Logo" className="" />
          <Image src={OneBataanLogo} alt="One Bataan Logo" className="" />
          <Image src={HermosaLogo} alt="Hermosa Logo" className="" />
          <Image src={HTBLogo} alt="Hataw Takbo Bataan Logo" className="" />
          <Image src={OneBataanLogo} alt="One Bataan Logo" className="" />
        </div>

        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="flex w-11/12 scale-y-125 flex-col items-center justify-center rounded-md bg-white p-2">
            <QrMaker
              value={`${bibCanvas?.distance.toString() ?? ""}-${
                bibCanvas?.id ?? ""
              }`}
              size={4}
            />
          </div>
        </div>
        <div className="col-span-3 grid grid-cols-6 items-center justify-center gap-2">
          <Image
            src={BataanSealLogo}
            alt="Bataan Seal"
            width={150}
            className="z-10 col-span-1"
          />
          <Image
            src={SeekPhorLogo}
            alt="Seek Phor"
            className="col-span-1"
            width={150}
          />
          <Image
            src={HTBLogo}
            alt="Hataw Takbo Bataan Logo"
            className="z-10 col-span-2 flex flex-col items-center justify-center"
            width={200}
          />
          <Image
            src={OneBataanLogo}
            alt="One Bataan Logo"
            width={150}
            className="z-10 col-span-1"
          />
          <Image
            src={HermosaLogo}
            alt="Hermosa Logo"
            width={150}
            className="z-10 col-span-1"
          />
        </div>
        <div className="z-10 col-span-1 m-1 flex flex-col items-center justify-center bg-white">
          <div
            className={`mt-[-50px] text-[3.25rem] tracking-tight ` + kmColor}
          >
            {bibCanvas?.distance}KM
          </div>
        </div>
      </div>

      <div className="row-span-3 flex h-[45%] flex-col items-center justify-center bg-white pt-2 text-[10.5rem] text-black">
        <p className="mt-[-180px] scale-150 scale-y-125">{bibNumber}</p>
      </div>

      <div className="row-span-1 flex h-[20%] border-t-2 border-solid border-black font-inter text-[2.8rem] font-bold tracking-tighter">
        <div className="relative flex h-full w-[35%] flex-col items-center justify-center border-r-2 border-solid border-black bg-[#125CF9] pb-2">
          <p className="mt-[-50px]">HATAW</p>
          <div className="absolute bottom-2 left-1 ml-2 h-2 w-2 rounded-md bg-white"></div>
        </div>
        <div className="relative flex h-full w-[30%] flex-col items-center justify-center border-r-2 border-solid border-black bg-km5 pb-2">
          <p className="mt-[-45px]">TAKBO</p>
          <div className="h-2 w-2 rounded-md"></div>
        </div>
        <div className="relative flex h-full w-[35%] flex-col items-center justify-center border-solid border-black bg-km3 pb-2">
          <p className="mr-2 mt-[-50px]">BATAAN</p>
          <div className="absolute bottom-2 right-1 ml-auto mr-2 h-2 w-2 rounded-md bg-white"></div>
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
