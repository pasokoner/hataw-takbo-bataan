import Link from "next/link";
import Image from "next/image";

import IconHatawBataan from "../assets/icon-hataw-bataan.webp";
import ScreenContainer from "./ScreenContainer";

const NavBar: React.FC = () => {
  return (
    <header className="w-full">
      <ScreenContainer
        as="nav"
        className="flex items-center justify-between border-b-2 py-4"
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
          className="rounded-md border-2  border-primary py-1 px-2 text-center text-sm text-primary transition-all hover:border-primary-hover hover:text-primary-hover md:px-4 md:py-2"
        >
          BROWSE EVENTS
        </Link>
        {/* <button className="rounded-md border-2 px-6 py-2 text-sm">Login</button> */}
      </ScreenContainer>
    </header>
  );
};

export default NavBar;
