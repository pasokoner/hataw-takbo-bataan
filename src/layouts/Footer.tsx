import React from "react";
import ScreenContainer from "./ScreenContainer";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-700">
      <ScreenContainer className="mx-auto flex flex-col items-center justify-center gap-2 bg-slate-700 py-10 px-8 text-slate-200 sm:flex-row sm:justify-between md:px-16 ">
        <p>© Copyright {new Date().getFullYear()}. All Rights Reserved</p>
      </ScreenContainer>
    </footer>
  );
};

export default Footer;
