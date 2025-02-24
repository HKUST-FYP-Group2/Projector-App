import React, { useCallback } from "react";
import Settings from "./settings.ts";

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
          second: settings.clock.show_second ? "2-digit" : undefined,
          hour12: settings.clock.hour_12,
        })
        .replace("am", "AM")
        .replace("pm", "PM");
    },
    [settings.clock.show_second, settings.clock.hour_12],
  );

  const [time, setTime] = React.useState(formatTime(new Date()));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 100);
    return () => clearInterval(interval);
  }, [formatTime]);

  if (!settings.clock.show_clock) return null;

  return (
    <div className={`absolute bottom-0 right-0 flex `}>
      <div
        className={`absolute z-30 w-full h-full blur opacity-60 fade-in-60 rounded-[30%]`}
        style={{ backgroundColor: `${settings.clock.background_color}` }}
      ></div>
      <div className={`z-40 px-5 py-3 w-full h-full select-none`}>
        <div
          className={`flex font-bold fade-in `}
          style={{
            fontSize: `${settings.clock.font_size.toString()}px`,
            color: `${settings.clock.font_color}`,
          }}
        >
          {time}
        </div>
      </div>
    </div>
  );
};

export default Clock;
