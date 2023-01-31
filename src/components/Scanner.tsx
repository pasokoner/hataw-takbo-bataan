import { useEffect, useCallback, useState } from "react";

import QrScanner from "qr-scanner";

type Props = {
  updateParticipant: (cameraResult: string, timeFinished: Date) => void;
};

const Scanner = ({ updateParticipant }: Props) => {
  const [cameraResult, setCameraResult] = useState("");

  const qrScanner = useCallback(() => {
    return new QrScanner(
      document.getElementById("video-feed") as HTMLVideoElement,
      (result: { data: string }) => {
        setCameraResult(result.data);
      },
      {
        /* your options or returnDetailedScanResult: true if you're not specifying any other options */
        highlightScanRegion: true,
        returnDetailedScanResult: true,
      }
    );
  }, [setCameraResult]);

  useEffect(() => {
    const myScanner = qrScanner();

    /* eslint-disable @typescript-eslint/no-floating-promises */
    myScanner.start();

    return () => {
      myScanner.destroy();
    };
  }, [qrScanner]);

  useEffect(() => {
    const now = new Date();

    // updateParticipant(cameraResult, now);
    updateParticipant(cameraResult, now);
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
  }, [cameraResult]);

  return (
    <div className="relative mx-auto mb-4 w-full max-w-[25rem]">
      <video id="video-feed" className="w-screen"></video>
      <div className="text-semibold absolute top-[80%] z-10 mx-auto flex w-full justify-center rounded-md bg-white bg-opacity-50 py-2 text-sm">
        {cameraResult}
      </div>
    </div>
  );
};

export default Scanner;
