import Link from "next/link";

import { useEffect, useCallback, useState } from "react";

import QrScanner from "qr-scanner";

const Scanner = () => {
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

    myScanner.start();

    return () => {
      myScanner.destroy();
    };
  }, [qrScanner]);

  return <video id="video-feed" className="h-[80] w-screen"></video>;
};

export default Scanner;
