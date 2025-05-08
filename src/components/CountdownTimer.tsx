"use client";

import { interviewStore } from "@/lib/utils/interviewStore";
import { useEffect } from "react";

interface CountdownTimerProps {
  minutes: number;
  setMinutes: React.Dispatch<React.SetStateAction<number>>;
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
}

export default function CountdownTimer({
  minutes,
  setMinutes,
  seconds,
  setSeconds,
}: CountdownTimerProps) {
  const seterSeconds = interviewStore((state) => state.setSeconds);
  const seterMinutes = interviewStore((state) => state.setMinutes);
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
      seterSeconds(seconds.toString().padStart(2, "0"));
      seterMinutes(minutes.toString().padStart(2, "0"));
    }, 1000);

    return () => clearInterval(interval);
    //eslint-disable-next-line
  }, [minutes, seconds]);

  return (
    <div className="bg-white/80 rounded-lg p-6 backdrop-blur-sm w-full">
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
