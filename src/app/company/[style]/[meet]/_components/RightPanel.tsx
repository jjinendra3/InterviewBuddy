"use client";
import { useState } from "react";
import { ResizablePanel } from "../../../../../components/ui/resizable";
import CountdownTimer from "../../../../../components/CountdownTimer";
import CamScreen from "./CamScreen";
import { Button } from "../../../../../components/ui/button";
import Loader from "../../../../../components/loader";
import {
  AiLottiePlayer,
  UserLottiePlayer,
} from "@/components/lottie/dotlottie";
import { interviewStore } from "@/lib/utils/interviewStore";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { isLoading, isRecording, aiSpeaking } = interviewStore();
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  return (
    <ResizablePanel
      defaultSize={25}
      className="flex flex-col h-full bg-white/80 p-4 rounded-lg shadow-lg m-2 backdrop-blur-sm"
    >
      <div className="w-full flex justify-center items-center">
        <Button
          onClick={() => {
            if (mediaStream) {
              mediaStream.getTracks().forEach((track) => track.stop());
            }
            router.push("/end");
          }}
        >
          End Meeting
        </Button>
      </div>
      <CountdownTimer
        minutes={minutes}
        seconds={seconds}
        setMinutes={setMinutes}
        setSeconds={setSeconds}
      />
      <div className="flex rounded-lg shadow-sm p-4 mb-4 bg-red-500">
        <CamScreen mediaStream={mediaStream} setMediaStream={setMediaStream} />
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
    </ResizablePanel>
  );
}
