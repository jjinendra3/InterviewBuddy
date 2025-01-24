"use client";

import { useState, useEffect } from "react";
import LeftPanel from "@/components/MeetingPage/LeftPanel";
import RightPanel from "@/components/MeetingPage/RightPanel";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const [code, setCode] = useState("// Your code here");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-[#FFE6C9] to-[#FFA09B]">
      <ResizablePanelGroup direction="horizontal">
        <LeftPanel code={code} setCode={setCode} />
        <ResizableHandle></ResizableHandle>
        <RightPanel />
      </ResizablePanelGroup>
    </div>
  );
}
