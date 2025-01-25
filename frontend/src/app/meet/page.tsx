"use client";

import { useState } from "react";
import LeftPanel from "@/components/MeetingPage/LeftPanel";
import RightPanel from "@/components/MeetingPage/RightPanel";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const [code, setCode] = useState("// Your code here");
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
