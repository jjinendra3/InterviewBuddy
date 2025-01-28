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
  interviewId: string,
) {
  IS_RECORDING = true;
  console.log("start recording");
  setIsRecording(IS_RECORDING);
  record(setIsLoading, setIsRecording, setAiSpeaking, interviewId);
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
  interviewId: string,
) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    console.log("Media stream acquired");
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
        console.log("Recording timeout");
        MEDIA_RECORDER?.stop();
        return;
      }

      if (
        anySoundDetected &&
        currentTime - lastDetectedTime > DELAY_BETWEEN_DIALOGS
      ) {
        console.log("Stoping");
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

    MEDIA_RECORDER.addEventListener("stop", () => {
      stream.getTracks().forEach((track) => track.stop());
      audioContext.close();

      if (!anySoundDetected) return;

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      sendAudio(
        audioBlob,
        setIsLoading,
        setIsRecording,
        setAiSpeaking,
        interviewId,
      );
    });
  });
}

export async function playAudio(
  audioBlob: Blob,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setAiSpeaking: React.Dispatch<React.SetStateAction<boolean>>,
  interviewId: string,
) {
  try {
    setAiSpeaking(true);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    setIsLoading(false);
    audio.play();
    audio.onended = async () => {
      URL.revokeObjectURL(audioUrl);
      setAiSpeaking(false);
      startRecording(setIsLoading, setIsRecording, setAiSpeaking, interviewId);
    };
  } catch (error) {
    console.error("Error during playback:", error);
  }
}

async function sendAudio(
  audioBlob: Blob,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setAiSpeaking: React.Dispatch<React.SetStateAction<boolean>>,
  interviewId: string,
) {
  if (!audioBlob) {
    startRecording(setIsLoading, setIsRecording, setAiSpeaking, interviewId);
    return;
  }

  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("interviewId", interviewId);
  setIsLoading(true);

  try {
    const response = await axios.post(
      "http://localhost:5000/transcribe",
      formData,
      { responseType: "arraybuffer" },
    );
    const responseBlob = new Blob([response.data], { type: "audio/wav" });
    await playAudio(
      responseBlob,
      setIsLoading,
      setIsRecording,
      setAiSpeaking,
      interviewId,
    );
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
