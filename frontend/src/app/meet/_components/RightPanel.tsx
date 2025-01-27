"use client";
import { ResizablePanel } from "../../../components/ui/resizable";
import CountdownTimer from "../../../components/CountdownTimer";
import CamScreen from "./CamScreen";
import { Button } from "../../../components/ui/button";
import Loader from "../../../components/loader";
import { LottiePlayer } from "@/lottie/dotlottie";
import {
  startRecording,
  stopRecording,
  endRecording,
} from "./silenceDetection";
import { Square, Mic } from "lucide-react";
export default function RightPanel({
  isLoading,
  isRecording,
  setIsLoading,
  setIsRecording,
}: {
  isLoading: boolean;
  isRecording: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <ResizablePanel
      defaultSize={25}
      className="flex flex-col h-full bg-white/80 p-4 rounded-lg shadow-lg m-2 backdrop-blur-sm"
    >
      <Button className="bg-red-500 flex justify-center items-center font-mono font-bold text-white text-xl">
        End Meeting
      </Button>
      <CountdownTimer initialMinutes={10} initialSeconds={0} />
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
          <LottiePlayer />
        </div>
      )}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={
            isRecording
              ? () => stopRecording(setIsRecording)
              : () => startRecording(setIsLoading, setIsRecording)
          }
          variant={isRecording ? "destructive" : "default"}
          className="w-32"
        >
          {isRecording ? (
            <>
              <Square className="mr-2 h-4 w-4" /> Send to AI
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" /> Start AI
            </>
          )}
        </Button>
        <Button
          onClick={() => {
            endRecording(setIsRecording);
            // setIsLoading(false);
          }}
          disabled={!isRecording}
          className="w-32"
        >
          End AI
        </Button>
      </div>
    </ResizablePanel>
  );
}
