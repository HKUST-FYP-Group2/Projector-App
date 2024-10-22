import React, { useCallback } from "react";
import Settings from "../data/settings.ts";

interface ClockProps {
  settings: Settings;
}

const Clock = ({ settings }: ClockProps) => {
  const formatTime = useCallback(
    (date: Date) => {
      return date
        .toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: settings.clock.showSecond ? "2-digit" : undefined,
          hour12: settings.clock.hour12,
        })
        .replace("am", "AM")
        .replace("pm", "PM");
    },
    [settings.clock.showSecond, settings.clock.hour12],
  );

  const [time, setTime] = React.useState(formatTime(new Date()));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 100);
    return () => clearInterval(interval);
  }, [formatTime]);

  if (!settings.clock.showClock) return null;

  return (
    <div className={`absolute bottom-0 right-0 flex `}>
      <div
        className={`absolute z-30 w-full h-full blur opacity-60 fade-in-60`}
        style={{ backgroundColor: `${settings.clock.backgroundColor}` }}
      ></div>
      <div className={`z-40 px-5 py-3 w-full h-full select-none`}>
        <div
          className={`flex font-bold fade-in `}
          style={{
            fontSize: `${settings.clock.fontSize.toString()}px`,
            color: `${settings.clock.fontColor}`,
          }}
        >
          {time}
        </div>
      </div>
    </div>
  );
};

export default Clock;
