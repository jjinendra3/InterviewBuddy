"use client";

import { useState } from "react";
import LeftPanel from "@/app/meet/_components/LeftPanel";
import RightPanel from "@/app/meet/_components/RightPanel";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const [code, setCode] = useState("// Your code here");
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
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
