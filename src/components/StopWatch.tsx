import React from "react";
import { useStopwatch } from "react-timer-hook";

import { CiStop1, CiPlay1, CiPause1 } from "react-icons/ci";

const Stopwatch = () => {
  const { seconds, minutes, hours, isRunning, start, pause } = useStopwatch({
    autoStart: false,
  });

  return (
    <div>
      <div className="mb-4 flex justify-center gap-2 text-6xl sm:text-7xl">
        <span className="block">
          {hours.toLocaleString().length === 1
            ? "0" + hours.toLocaleString()
            : hours}
        </span>
        :
        <span className="block">
          {minutes.toLocaleString().length === 1
            ? "0" + minutes.toLocaleString()
            : minutes}
        </span>
        :
        <span className="block">
          {seconds.toLocaleString().length === 1
            ? "0" + seconds.toLocaleString()
            : seconds}
        </span>
      </div>
      {/* <p>{isRunning ? "Running" : "Not running"}</p> */}
      <div className="flex justify-center gap-8">
        <button
          onClick={() => {
            pause();
          }}
          className="text-5xl"
        >
          <CiStop1 />
        </button>

        {isRunning ? (
          <button onClick={pause} className="text-5xl">
            <CiPause1 />
          </button>
        ) : (
          <button onClick={start} className="text-5xl">
            <CiPlay1 />
          </button>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
