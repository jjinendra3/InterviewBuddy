import axios from "axios";
import React from "react";

const VOICE_MIN_DECIBELS = -35;
const DELAY_BETWEEN_DIALOGS = 3000;
const DIALOG_MAX_LENGTH = 60000;
//eslint-disable-next-line
let MEDIA_RECORDER: any = null;
let IS_RECORDING = false;

export function startRecording(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
) {
  IS_RECORDING = true;
  console.log("start recording");
  setIsRecording(IS_RECORDING);
  record(setIsLoading, setIsRecording);
}

export function stopRecording(
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
) {
  IS_RECORDING = false;
  console.log("stop recording");
  setIsRecording(IS_RECORDING);
  if (MEDIA_RECORDER !== null) MEDIA_RECORDER.stop();
}

//record:
// eslint-disable-next-line
function record(setIsLoading: any, setIsRecording: any) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    console.log("cool");
    //start recording:
    MEDIA_RECORDER = new MediaRecorder(stream);
    MEDIA_RECORDER.start();

    //save audio chunks:
    //eslint-disable-next-line
    const audioChunks: any = [];
    //eslint-disable-next-line
    MEDIA_RECORDER.addEventListener("dataavailable", (event: any) => {
      console.log(event);
      audioChunks.push(event.data);
    });

    //analisys:
    const audioContext = new AudioContext();
    const audioStreamSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.minDecibels = VOICE_MIN_DECIBELS;
    audioStreamSource.connect(analyser);
    const bufferLength = analyser.frequencyBinCount;
    const domainData = new Uint8Array(bufferLength);

    //loop:
    let time = new Date();
    const startTime: number = time.getTime();
    let lastDetectedTime: number = time.getTime();
    let anySoundDetected = false;
    const detectSound = () => {
      //recording stoped by user:
      if (!IS_RECORDING) return;

      time = new Date();
      const currentTime = time.getTime();

      //time out:
      if (currentTime > startTime + DIALOG_MAX_LENGTH) {
        console.log("Time out");
        MEDIA_RECORDER.stop();
        return;
      }

      //a dialog detected:
      if (
        anySoundDetected === true &&
        currentTime > lastDetectedTime + DELAY_BETWEEN_DIALOGS
      ) {
        console.log("Dialog detected");
        MEDIA_RECORDER.stop();
        return;
      }

      //check for detection:
      analyser.getByteFrequencyData(domainData);
      for (let i = 0; i < bufferLength; i++)
        if (domainData[i] > 0) {
          anySoundDetected = true;
          time = new Date();
          lastDetectedTime = time.getTime();
        }

      //continue the loop:
      window.requestAnimationFrame(detectSound);
    };
    window.requestAnimationFrame(detectSound);

    //stop event:
    MEDIA_RECORDER.addEventListener("stop", () => {
      //stop all the tracks:
      console.log("big daddy");
      setIsRecording(false);
      stream.getTracks().forEach((track) => track.stop());
      if (!anySoundDetected) return;

      //send to server:
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      sendAudio(audioBlob, setIsLoading, setIsRecording);
    });
  });
}

async function playAudio(
  audioBlob: Blob,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
) {
  try {
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    setIsLoading(false);
    audio.play();

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      startRecording(setIsLoading, setIsRecording);
    };
  } catch (error) {
    console.error("Error during transcription:", error);
  }
}

async function sendAudio(
  audioBlob: Blob,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (!audioBlob) {
    startRecording(setIsLoading, setIsRecording);
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
    await playAudio(audioBlob, setIsLoading, setIsRecording);
  } catch (error) {
    setIsLoading(false);
    console.error("Error during transcription:", error);
  }
}

export async function endRecording(
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
) {
  MEDIA_RECORDER.stop();
  setIsRecording(false);
  return;
}
