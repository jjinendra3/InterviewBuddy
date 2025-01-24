"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  initialMinutes: number;
  initialSeconds: number;
}

export default function CountdownTimer({
  initialMinutes,
  initialSeconds,
}: CountdownTimerProps) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds]);

  return (
    <div className="bg-white/80 rounded-lg p-6 backdrop-blur-sm">
      <div className="w-full flex justify-center items-center rounded-lg">
        <h1 className="font-bold text-xl font-mono">Time Left</h1>
      </div>
      <div className="flex justify-center items-center space-x-4">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold text-[#FFA09B]">
            {minutes.toString().padStart(2, "0")}
          </div>
          <div className="text-sm text-gray-600">Minutes</div>
        </div>
        <div className="text-4xl font-bold text-gray-800">:</div>
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold text-[#FFC785]">
            {seconds.toString().padStart(2, "0")}
          </div>
          <div className="text-sm text-gray-600">Seconds</div>
        </div>
      </div>
    </div>
  );
}
