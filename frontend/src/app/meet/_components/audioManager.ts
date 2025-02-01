import { playPing } from "@/components/pingSound";
import axios from "axios";
import React from "react";
const VOICE_MIN_DECIBELS = -60;
const DELAY_BETWEEN_DIALOGS = 3000;
const DIALOG_MAX_LENGTH = 60000;
let MEDIA_RECORDER: MediaRecorder | null = null;
let IS_RECORDING = false;

export function startRecording(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setAiSpeaking: React.Dispatch<React.SetStateAction<boolean>>,
) {
  IS_RECORDING = true;
  setIsRecording(IS_RECORDING);
  record(setIsLoading, setIsRecording, setAiSpeaking);
}

export function stopRecording(
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
) {
  IS_RECORDING = false;
  setIsRecording(IS_RECORDING);
  if (MEDIA_RECORDER !== null) MEDIA_RECORDER.stop();
}

function record(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setAiSpeaking: React.Dispatch<React.SetStateAction<boolean>>,
) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    MEDIA_RECORDER = new MediaRecorder(stream);
    MEDIA_RECORDER.start();

    const audioChunks: BlobPart[] = [];
    MEDIA_RECORDER.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    const audioContext = new AudioContext();
    const audioStreamSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.minDecibels = VOICE_MIN_DECIBELS;
    audioStreamSource.connect(analyser);

    const bufferLength = analyser.fftSize;
    const domainData = new Uint8Array(bufferLength);

    const startTime = Date.now();
    let lastDetectedTime = Date.now();
    let anySoundDetected = false;

    const detectSound = () => {
      if (!IS_RECORDING) return;

      const currentTime = Date.now();

      if (currentTime - startTime > DIALOG_MAX_LENGTH) {
        MEDIA_RECORDER?.stop();
        return;
      }

      if (
        anySoundDetected &&
        currentTime - lastDetectedTime > DELAY_BETWEEN_DIALOGS
      ) {
        setIsRecording(false);
        MEDIA_RECORDER?.stop();
        return;
      }

      analyser.getByteTimeDomainData(domainData);
      const isSoundDetected = domainData.some((value) => value > 128);
      if (isSoundDetected) {
        anySoundDetected = true;
        lastDetectedTime = currentTime;
      }

      window.requestAnimationFrame(detectSound);
    };
    window.requestAnimationFrame(detectSound);

    MEDIA_RECORDER.addEventListener("stop", async () => {
      stream.getTracks().forEach((track) => track.stop());
      audioContext.close();
      if (!anySoundDetected) return;
      await playPing();
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      sendAudio(audioBlob, setIsLoading, setIsRecording, setAiSpeaking);
    });
  });
}

export async function playAudio(
  audioBlob: Blob,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setAiSpeaking: React.Dispatch<React.SetStateAction<boolean>>,
) {
  try {
    await playPing();
    setAiSpeaking(true);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    setIsLoading(false);
    audio.play();
    await new Promise((resolve) => {
      audio.onended = resolve;
    });
    URL.revokeObjectURL(audioUrl);
    await playPing();
    setAiSpeaking(false);
    startRecording(setIsLoading, setIsRecording, setAiSpeaking);
  } catch (error) {
    console.error("Error during playback:", error);
  }
}

async function sendAudio(
  audioBlob: Blob,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setAiSpeaking: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const interviewId = await localStorage.getItem("interviewId");
  if (!audioBlob || !interviewId) {
    startRecording(setIsLoading, setIsRecording, setAiSpeaking);
    return;
  }
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("interviewId", interviewId);
  setIsLoading(true);

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/transcribe`,
      formData,
      { responseType: "arraybuffer" },
    );
    const responseBlob = new Blob([response.data], { type: "audio/wav" });
    await playAudio(responseBlob, setIsLoading, setIsRecording, setAiSpeaking);
  } catch (error) {
    setIsLoading(false);
    console.error("Error during transcription:", error);
  }
}

export async function endRecording(
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (MEDIA_RECORDER) MEDIA_RECORDER.stop();
  setIsRecording(false);
}
