import React from "react";
import NavBar from "./NavBar";
import ScreenContainer from "./ScreenContainer";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

const PageContainer = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar />

      {/* <ScreenContainer
        as="main"
        className="mx-auto px-8 md:px-16"
      >{children}</ScreenContainer> */}
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};

export default PageContainer;
