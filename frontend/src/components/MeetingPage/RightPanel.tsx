import { ResizablePanel } from "../ui/resizable";
import CountdownTimer from "../CountdownTimer";
import WebcamProctor from "../Proctoring";
export default function RightPanel() {
  return (
    <ResizablePanel
      defaultSize={25}
      className="flex flex-col h-full bg-white/80 p-4 rounded-lg shadow-lg m-2 backdrop-blur-sm"
    >
      <CountdownTimer initialMinutes={10} initialSeconds={0} />
      <div className="flex rounded-lg shadow-sm p-4 mb-4">
        <WebcamProctor />
      </div>
    </ResizablePanel>
  );
}
