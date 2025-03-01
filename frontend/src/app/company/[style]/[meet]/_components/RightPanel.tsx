"use client";
import { ResizablePanel } from "../../../../../components/ui/resizable";
import CountdownTimer from "../../../../../components/CountdownTimer";
import CamScreen from "./CamScreen";
import { Button } from "../../../../../components/ui/button";
import Loader from "../../../../../components/loader";
import {
  AiLottiePlayer,
  UserLottiePlayer,
} from "@/components/lottie/dotlottie";
import { Square, Mic } from "lucide-react";
import { interviewStore } from "@/lib/interviewStore";
export default function RightPanel({
  minutes,
  seconds,
  setMinutes,
  setSeconds,
}: {
  minutes: number;
  seconds: number;
  setMinutes: React.Dispatch<React.SetStateAction<number>>;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { isLoading, isRecording, aiSpeaking, startRecording, stopRecording } =
    interviewStore();
  return (
    <ResizablePanel
      defaultSize={25}
      className="flex flex-col h-full bg-white/80 p-4 rounded-lg shadow-lg m-2 backdrop-blur-sm"
    >
      <Button className="bg-red-500 flex justify-center items-center font-mono font-bold text-white text-xl">
        End Meeting
      </Button>
      <CountdownTimer
        minutes={minutes}
        seconds={seconds}
        setMinutes={setMinutes}
        setSeconds={setSeconds}
      />
      <div className="flex rounded-lg shadow-sm p-4 mb-4 bg-red-500">
        <CamScreen />
      </div>
      {isLoading && (
        <div className="w-full flex flex-col justify-center items-center">
          <div className="p-4">
            <Loader />
          </div>
          <span>AI is thinking!</span>
        </div>
      )}
      {isRecording && (
        <div className="flex justify-center items-center w-full">
          <UserLottiePlayer />
        </div>
      )}
      {aiSpeaking && (
        <div className="flex justify-center items-center w-full">
          <AiLottiePlayer />
        </div>
      )}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={isRecording ? () => stopRecording() : () => startRecording()}
          variant={isRecording ? "destructive" : "default"}
          className="w-32"
        >
          {isRecording ? (
            <>
              <Square className="mr-2 h-4 w-4" /> Speak Now...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" /> Start Speaking
            </>
          )}
        </Button>
      </div>
    </ResizablePanel>
  );
}
