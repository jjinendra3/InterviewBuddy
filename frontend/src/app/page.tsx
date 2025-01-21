"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVoiceRecorder } from "./useVoiceRecorder";
import { Mic, Square } from "lucide-react";
import axios from "axios";
import Loader from "./loader";

export default function VoiceTranscriptionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    endRecording,
  } = useVoiceRecorder();

  const handleTranscription = async () => {
    if (!audioBlob) {
      startRecording();
      return;
    }
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/transcribe",
        formData,
        {
          responseType: "arraybuffer",
        },
      );
      const audioBlob = new Blob([response.data], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      setIsLoading(false);
      audio.play();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        startRecording();
      };
    } catch (error) {
      setIsLoading(false);
      console.error("Error during transcription:", error);
    }
  };
  useEffect(() => {
    if (audioBlob) {
      handleTranscription();
    }
    // eslint-disable-next-line
  }, [audioBlob]);

  return (
    <div className="min-h-screen flex-col gap bg-gray-900 text-white flex items-center justify-center p-4">
      {isLoading && (
        <div className="mb-4">
          <Loader />
        </div>
      )}
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Interview Buddy Initial Iteration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className="w-32"
            >
              {isRecording ? (
                <>
                  <Square className="mr-2 h-4 w-4" /> Send to AI
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" /> Start AI
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                endRecording();
                setIsLoading(false);
              }}
              disabled={!isRecording}
              className="w-32"
            >
              End AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
