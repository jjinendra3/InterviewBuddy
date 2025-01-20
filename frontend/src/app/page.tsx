"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceRecorder } from "./useVoiceRecorder";
import { Mic, Square } from "lucide-react";
import axios from "axios";

export default function VoiceTranscriptionPage() {
  const [transcription, setTranscription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { isRecording, audioBlob, startRecording, stopRecording } =
    useVoiceRecorder();
  const handleTranscription = async () => {
    if (!audioBlob) {
      console.warn("No audioBlob available for transcription.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const response = await axios.post("http://localhost:5000/transcribe", formData);
      console.log(response);

      if (response?.data) {
        console.log("Transcription response:", response.data);
        setTranscription(response.data);
      } else {
        console.error("Invalid response format:", response);
        setTranscription("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error during transcription:", error);
      setTranscription("An error occurred during transcription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Voice Transcription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={
                isRecording
                  ? stopRecording
                  : startRecording
              }
              variant={isRecording ? "destructive" : "default"}
              className="w-32"
            >
              {isRecording ? (
                <>
                  <Square className="mr-2 h-4 w-4" /> Stop
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" /> Record
                </>
              )}
            </Button>
            <Button
              onClick={handleTranscription}
              disabled={!audioBlob || isLoading}
              className="w-32"
            >
              {isLoading ? "Processing..." : "Transcribe"}
            </Button>
          </div>
          <Textarea
            placeholder="Transcription will appear here..."
            value={transcription}
            readOnly
            className="h-40 bg-gray-700 border-gray-600 text-white"
          />
        </CardContent>
      </Card>
    </div>
  );
}
