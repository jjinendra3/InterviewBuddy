"use client";

import { useState, useEffect } from "react";
import LeftPanel from "@/app/meet/_components/LeftPanel";
import RightPanel from "@/app/meet/_components/RightPanel";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { playAudio } from "./_components/audioManager";
import { useStore } from "@/lib/store";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
export default function Home() {
  const startInterview = useStore((state) => state.startInterview);
  const [code, setCode] = useState("// Your code here");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("User has left the tab");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);
  useGSAP(() => {
    async function interviewIntro() {
      const introduction = await startInterview(setIsLoading);
      await playAudio(
        introduction,
        setIsLoading,
        setIsRecording,
        setAiSpeaking,
      );
    }
    interviewIntro();
  });
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
          aiSpeaking={aiSpeaking}
          setIsRecording={setIsRecording}
          setIsLoading={setIsLoading}
          setAiSpeaking={setAiSpeaking}
          minutes={minutes}
          seconds={seconds}
          setMinutes={setMinutes}
          setSeconds={setSeconds}
        />
      </ResizablePanelGroup>
    </div>
  );
}
