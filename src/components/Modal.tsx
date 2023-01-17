import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

type Props = {
  show?: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal(props: Props) {
  const { show, onClose, children } = props;

  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = () => {
    console.log("sheesh");
    onClose();
  };

  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [show]);

  const modalContent = show ? (
    <>
      <div
        className="fixed inset-0 bg-black opacity-25"
        onClick={handleCloseClick}
      ></div>
      <div className="opacity-85 fixed inset-80 top-10 bottom-auto justify-center overflow-y-auto overflow-x-hidden rounded-md bg-white outline-none focus:outline-none md:h-auto">
        {children}
      </div>
    </>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root") as HTMLElement
    );
  } else {
    return null;
  }
}
