"use client";

import { useState, useEffect, useCallback } from "react";
import LeftPanel from "./_components/LeftPanel";
import RightPanel from "./_components/RightPanel";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { generalStore } from "@/lib/utils/generalStore";
import { toaster } from "@/components/toast";
import { useRouter } from "next/navigation";
import { interviewStore } from "@/lib/utils/interviewStore";
import { useConversation } from "@11labs/react";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("// Your code here");
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const mins = interviewStore((state) => state.minutes);
  const secs = interviewStore((state) => state.seconds);

  const { setSubtitles } = interviewStore();
  const candidate = generalStore((state) => state.candidate);
  if (!candidate) {
    console.log("Please Login to start the meet.");
  }
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: (error) => console.log("Disconnected", error),
    onMessage: (message: { message: string; source: string }) => {
      console.log("Message received:", message);
      setSubtitles(message.message);
    },
    onError: (error) => console.error("Error:", error),
  });

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID ?? "",
        dynamicVariables: {
          new_variable: candidate?.name ?? "User",
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [candidate, conversation]);

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toaster("You are not allowed to switch tabs.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (mins === "00" && secs === "00") {
      stopConversation();
      router.push("/end");
    }
  }, [mins, secs, router, stopConversation]);

  useEffect(() => {
    if (!candidate) {
      toaster("Please Login to start the meet.");
      setTimeout(() => {
        router.push("/");
      }, 1000);
      return;
    }
  }, [candidate, router]);

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-[#FFE6C9] to-[#FFA09B]">
      <ResizablePanelGroup direction="horizontal">
        <LeftPanel code={code} setCode={setCode} />
        <RightPanel
          minutes={minutes}
          seconds={seconds}
          setMinutes={setMinutes}
          setSeconds={setSeconds}
          conversation={conversation}
          stopConversation={stopConversation}
        />
      </ResizablePanelGroup>
    </div>
  );
}
