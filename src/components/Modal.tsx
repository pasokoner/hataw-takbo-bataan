import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { RxCross2 } from "react-icons/rx";

type Props = {
  show?: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal(props: Props) {
  const { show, onClose, children, title } = props;

  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

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
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden py-10 outline-none focus:outline-none">
        <div className="relative mx-auto my-auto w-11/12 max-w-3xl md:w-auto">
          {/*content*/}
          <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/*header*/}
            {title && (
              <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                <h3 className="text-xl font-semibold">{title}</h3>
                <button
                  className="float-right ml-auto border-0 bg-transparent p-1 text-xl font-semibold leading-none text-black outline-none focus:outline-none md:text-3xl"
                  onClick={onClose}
                >
                  <RxCross2 className="bg-transparent text-2xl text-black outline-none focus:outline-none" />
                </button>
              </div>
            )}
            {/*body*/}
            <div className="relative flex-auto p-2 md:p-6">{children}</div>
          </div>
        </div>
      </div>
      <div
        className="fixed inset-0 z-40 bg-black opacity-25"
        onClick={onClose}
      ></div>
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
