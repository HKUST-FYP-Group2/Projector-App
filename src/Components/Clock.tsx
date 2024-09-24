import React from "react";

interface ClockProps {
  fontStyle: String;
  position: String;
}

const Clock = ({ fontStyle, position }: ClockProps) => {
  const [time, setTime] = React.useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div className={`flex ${fontStyle} ${position}`}>{time}</div>;
};

export default Clock;
