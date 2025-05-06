"use client";
import { useState } from "react";
import { ResizablePanel } from "../../../../../components/ui/resizable";
import CountdownTimer from "../../../../../components/CountdownTimer";
import CamScreen from "./CamScreen";
import { Button } from "../../../../../components/ui/button";
import {
  AiLottiePlayer,
  UserLottiePlayer,
} from "@/components/lottie/dotlottie";
import { interviewStore } from "@/lib/utils/interviewStore";
import { useRouter } from "next/navigation";
import { Conversation } from "@/app/company/[style]/[meet]/_components/Conversation";
export default function RightPanel({
  minutes,
  seconds,
  setMinutes,
  setSeconds,
  conversation,
  stopConversation,
}: {
  minutes: number;
  seconds: number;
  setMinutes: React.Dispatch<React.SetStateAction<number>>;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversation: any;
  stopConversation: () => Promise<void>;
}) {
  const router = useRouter();
  const { isRecording, aiSpeaking } = interviewStore();
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
      <Conversation
        conversation={conversation}
        stopConversation={stopConversation}
      />
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
