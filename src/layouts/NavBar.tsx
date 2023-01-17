import React from "react";
import ScreenContainer from "./ScreenContainer";
import Image from "next/image";
import IconHatawBataan from "../assets/icon-hataw-bataan.webp";

const NavBar: React.FC = () => {
  return (
    <header className="w-full">
      <ScreenContainer
        as="nav"
        className="mx-auto flex items-center justify-between border-b-2 px-16 py-4"
      >
        <div className="flex items-center justify-center gap-2">
          <Image
            src={IconHatawBataan}
            height={50}
            width={50}
            alt="Hataw Bataan Icon"
          />
          <h1 className="text-3xl font-semibold">
            <span className="text-[#0062ad]">Hataw </span>
            <span className="text-[#d33d49]">Takbo </span>
            <span className="text-[#0d632b]">Bataan</span>
          </h1>
        </div>

        {/* <button className="rounded-md border-2 px-6 py-2 text-sm">Login</button> */}
      </ScreenContainer>
    </header>
  );
};

export default NavBar;
