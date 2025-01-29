"use client";

import { useState } from "react";
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
  const interviewId = useStore((state) => state.interviewId);

  const [code, setCode] = useState("// Your code here");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  // useEffect(() => {
  //   async function interviewIntro() {
  //     if (!once) return;
  //     setonce(false);
  //     const introduction = await startInterview(setIsLoading);
  //     await playAudio(
  //       introduction,
  //       setIsLoading,
  //       setIsRecording,
  //       setAiSpeaking,
  //       interviewId,
  //     );
  //   }
  //   interviewIntro();
  //   //eslint-disable-next-line
  // }, []);
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
          interviewId={interviewId}
        />
      </ResizablePanelGroup>
    </div>
  );
}
