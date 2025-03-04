"use client";

import { useState, useEffect } from "react";
import LeftPanel from "./_components/LeftPanel";
import RightPanel from "./_components/RightPanel";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { generalStore } from "@/lib/utils/generalStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toaster } from "@/components/toast";
import { useRouter } from "next/navigation";
import { interviewStore } from "@/lib/utils/interviewStore";
gsap.registerPlugin(useGSAP);

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("// Your code here");
  const { playAudio } = interviewStore();
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const startAudio = generalStore((state) => state.startAudio);
  const setStartAudio = generalStore((state) => state.setStartAudio);
  const candidate = generalStore((state) => state.candidate);
  if (!candidate) {
    console.log("Please Login to start the meet.");
  }
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

  useEffect(() => {
    if (!candidate) {
      toaster("Please Login to start the meet.");
      setTimeout(() => {
        router.push("/");
      }, 1000);
      return;
    }
    //eslint-disable-next-line
  }, []);

  useGSAP(() => {
    async function interviewIntro() {
      if (startAudio) {
        await playAudio(startAudio);
        setStartAudio(null);
      }
    }
    interviewIntro();
  });
  //eslint-disable-next-line
  const [interViewStyle, setInterViewStyle] = useState<"HR" | "DSA">("HR");
  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-[#FFE6C9] to-[#FFA09B]">
      <ResizablePanelGroup direction="horizontal">
        <LeftPanel code={code} setCode={setCode} />
        <ResizableHandle></ResizableHandle>
        <RightPanel
          minutes={minutes}
          seconds={seconds}
          setMinutes={setMinutes}
          setSeconds={setSeconds}
        />
      </ResizablePanelGroup>
    </div>
  );
}
