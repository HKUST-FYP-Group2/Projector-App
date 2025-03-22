import { useRef, useState } from "react";

interface ConfirmWindowProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirmWindowShown?: boolean;
}

const ConfirmWindow = ({
  message,
  onConfirm,
  onCancel,
  isConfirmWindowShown,
}: ConfirmWindowProps) => {
  const [fadingout, setFadingout] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  if (!isConfirmWindowShown) return null;
  return (
    <div className="w-full h-full flex items-center justify-center z-40 absolute">
      <div
        className={`bg-blue p-4 ${fadingout ? `fade-out-short` : `fade-in-short `} rounded-[20px] shadow-lg bg-opacity-90 py-[25px] px-[30px] select-none text-lg font-semibold max-w-[350px]`}
        ref={divRef}
        onAnimationStart={() => {}}
        onAnimationEnd={() => {
          if (fadingout && divRef.current !== null) {
            divRef.current.style.visibility = "hidden";
            if (isConfirm) {
              onConfirm();
            }
            if (isCancel) {
              onCancel();
            }
            setFadingout(false);
            setIsConfirm(false);
            setIsCancel(false);
          }
        }}
      >
        <p>{message}</p>
        <div className={`flex w-full h-fit mt-4 justify-end`}>
          <button
            onClick={() => {
              setFadingout(true);
              setIsConfirm(true);
            }}
            className={`border-2 border-green-3 rounded px-3 text-green-3 hover:bg-green-3 hover:bg-opacity-30 text-center`}
          >
            Yes
          </button>
          <div className="w-3"></div>
          <button
            onClick={() => {
              setFadingout(true);
              setIsCancel(true);
            }}
            className={`border-2 border-red-1 rounded px-3 text-red-1 hover:bg-red-1 hover:bg-opacity-30 `}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmWindow;
