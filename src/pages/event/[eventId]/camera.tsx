import { type NextPage } from "next";
import React from "react";
import Scanner from "../../../components/Scanner";

const Camera: NextPage = () => {
  return (
    <div>
      <h2>Detect Finisher</h2>
      <Scanner />
    </div>
  );
};

export default Camera;
