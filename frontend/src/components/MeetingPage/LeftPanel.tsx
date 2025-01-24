"use client";
import { Editor } from "@monaco-editor/react";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "../ui/resizable";

interface LeftPanelProps {
  code: string;
  setCode: (code: string) => void;
}

export default function LeftPanel({ code, setCode }: LeftPanelProps) {
  return (
    <ResizablePanel defaultSize={75} className="flex flex-col h-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={25}
          className="bg-white/80 p-6 overflow-auto rounded-lg shadow-lg m-2 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Question</h2>
          <p className="text-gray-700">Your question content goes here...</p>
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
              defaultLanguage="javascript"
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
    </ResizablePanel>
  );
}
