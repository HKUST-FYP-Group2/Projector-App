import React from "react";

interface ClockProps {
  fontStyle: string;
  position: string;
  clockSettings: {
    showClock: boolean;
    showSecond: boolean;
    hour12: boolean;
  };
}

const Clock = ({ fontStyle, position, clockSettings }: ClockProps) => {
  const formatTime = (date: Date) => {
    return date
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: clockSettings.showSecond ? "2-digit" : undefined,
        hour12: clockSettings.hour12,
      })
      .replace("am", "AM")
      .replace("pm", "PM");
  };

  const [time, setTime] = React.useState(formatTime(new Date()));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, [clockSettings]);

  return <div className={`flex ${fontStyle} ${position}`}>{time}</div>;
};

export default Clock;
