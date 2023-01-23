import { useEffect, useCallback, useState } from "react";

import QrScanner from "qr-scanner";
import { Event } from "@prisma/client";

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
  }, [cameraResult]);

  return <video id="video-feed" className="mb-4 w-screen"></video>;
};

export default Scanner;
