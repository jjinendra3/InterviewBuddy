"use client";
import { Editor } from "@monaco-editor/react";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { CircleUserRound, Code } from "lucide-react";
import { usePathname } from "next/navigation";
import { interviewStore } from "@/lib/utils/interviewStore";
import Markdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeftPanelProps {
  code: string;
  setCode: (code: string) => void;
  question?: string;
}

export default function LeftPanel({ code, setCode, question }: LeftPanelProps) {
  const pathname = usePathname();
  const { subtitles } = interviewStore();

  return (
    <ResizablePanel defaultSize={75} className="flex flex-col h-full">
      {!pathname.includes("hr") ? (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={25}
            className="bg-white/80 p-6 overflow-auto rounded-lg shadow-lg m-2 backdrop-blur-sm"
          >
            {question ? (
              <ScrollArea className="flex flex-col h-full text-gray-500">
                <Markdown>{question}</Markdown>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Code size={40} className="text-gray-500 mr-2" />
                DSA Question Upcoming
              </div>
            )}
          </ResizablePanel>
          <ResizableHandle className="border-2" />
          <ResizablePanel
            defaultSize={75}
            className="bg-white/80 p-6 flex flex-col rounded-lg shadow-lg m-2 backdrop-blur-sm h-full"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Answer</h2>
            <div className="h-full rounded-lg overflow-hidden">
              <Editor
                height="100%"
                language="cpp"
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                }}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="h-full flex flex-col gap-6 items-center p-6 text-center backdrop-blur-sm transition-all duration-300 ease-in-out justify-center">
          <div className="flex flex-col gap-4 items-center">
            <CircleUserRound size={120} className="text-white drop-shadow-xl" />
            <h1 className="font-mono text-2xl font-extrabold text-white">
              HR Interview with Google!
            </h1>
          </div>

          {subtitles && (
            <div className="bg-white/90 text-white w-full p-4 rounded-xl shadow-xl">
              <p className="text-base font-medium leading-relaxed whitespace-pre-wrap text-gray-800">
                {subtitles}
              </p>
            </div>
          )}
        </div>
      )}
    </ResizablePanel>
  );
}
