"use client";

import { useState, useEffect } from "react";
import LeftPanel from "@/app/meet/_components/LeftPanel";
import RightPanel from "@/app/meet/_components/RightPanel";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { playAudio } from "./_components/silenceDetection";
import { useStore } from "@/lib/store";
export default function Home() {
  const startInterview = useStore((state) => state.startInterview);
  const [code, setCode] = useState("// Your code here");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        alert("You are switching tabs. Your recording will be stopped.");
      }
    });
    return () => {
      window.removeEventListener("visibilitychange", () => {});
    };
  }, []);

  useEffect(() => {
    async function interviewIntro() {
      const introduction = await startInterview(setIsLoading);
      await playAudio(introduction, setIsLoading, setIsRecording);
    }
    interviewIntro();
  }, []);

  //eslint-disable-next-line
  const [interViewStyle, setInterViewStyle] = useState<"HR" | "DSA">("HR");
  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-[#FFE6C9] to-[#FFA09B]">
      <ResizablePanelGroup direction="horizontal">
        <LeftPanel
          code={code}
          setCode={setCode}
          interViewStyle={interViewStyle}
        />
        <ResizableHandle></ResizableHandle>
        <RightPanel
          isLoading={isLoading}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          setIsLoading={setIsLoading}
        />
      </ResizablePanelGroup>
    </div>
  );
}
