import React from "react";
import ScreenContainer from "./ScreenContainer";
import Image from "next/image";
import IconHatawBataan from "../assets/icon-hataw-bataan.webp";
import Link from "next/link";

const NavBar: React.FC = () => {
  return (
    <header className="w-full">
      <ScreenContainer
        as="nav"
        className="mx-auto flex items-center justify-between border-b-2 px-8 py-4 md:px-16"
      >
        <Link href={"/"} className="flex items-center  gap-2">
          <Image
            src={IconHatawBataan}
            height={50}
            width={50}
            alt="Hataw Bataan Icon"
          />
          <h1 className="text-lg font-semibold md:text-3xl">
            <span className="text-[#0062ad]">Hataw </span>
            <span className="text-[#d33d49]">Takbo </span>
            <span className="text-[#0d632b]">Bataan</span>
          </h1>
        </Link>

        <Link
          href={"/event"}
          className="rounded-md border-primary bg-primary py-1 px-2 text-center text-sm text-white hover:bg-sky-600 md:px-4 md:py-2"
        >
          SHOW EVENTS
        </Link>
        {/* <button className="rounded-md border-2 px-6 py-2 text-sm">Login</button> */}
      </ScreenContainer>
    </header>
  );
};

export default NavBar;
