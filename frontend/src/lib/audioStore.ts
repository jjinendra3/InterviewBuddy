import axios from "axios";
import { create } from "zustand";
import { AudioStore } from "./types";

const VOICE_MIN_DECIBELS = -60;
const DELAY_BETWEEN_DIALOGS = 3000;
const DIALOG_MAX_LENGTH = 60000;
//eslint-disable-next-line
let MEDIA_RECORDER: any = null;

export const audioStore = create<AudioStore>()((set, get) => ({
  isRecording: false,
  aiSpeaking: false,
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  setAiSpeaking: (speaking) => set({ aiSpeaking: speaking }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  playPing: async () => {
    const audio = new Audio("/sound/ping.mp3");
    await audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  },
  startRecording: async () => {
    set({ isRecording: true });
    get().record();
  },
  stopRecording: () => {
    set({ isRecording: false });
    if (MEDIA_RECORDER !== null) MEDIA_RECORDER.stop();
  },
  record: async () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      MEDIA_RECORDER = new MediaRecorder(stream);
      MEDIA_RECORDER.start();

      const audioChunks: BlobPart[] = [];
      //eslint-disable-next-line
      MEDIA_RECORDER.addEventListener("dataavailable", (event: any) => {
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
        if (!get().isRecording) return;

        const currentTime = Date.now();

        if (currentTime - startTime > DIALOG_MAX_LENGTH) {
          MEDIA_RECORDER.stop();
          return;
        }

        if (
          anySoundDetected &&
          currentTime - lastDetectedTime > DELAY_BETWEEN_DIALOGS
        ) {
          set({ isRecording: false });
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
        await get().playPing();
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        get().sendAudio(audioBlob);
      });
    });
  },
  playAudio: async (audioBlob: Blob) => {
    try {
      await get().playPing();
      set({ aiSpeaking: true });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      set({ isLoading: false });
      audio.play();
      await new Promise((resolve) => {
        audio.onended = resolve;
      });
      URL.revokeObjectURL(audioUrl);
      await get().playPing();
      set({ aiSpeaking: false });
      get().startRecording();
    } catch (error) {
      console.error("Error during playback:", error);
    }
  },
  sendAudio: async (audioBlob: Blob) => {
    const interviewId = await localStorage.getItem("interviewId");
    const seconds = await localStorage.getItem("seconds");
    const minutes = await localStorage.getItem("minutes");
    if (!audioBlob || !interviewId) {
      get().startRecording();
      return;
    }
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("interviewId", interviewId);
    formData.append("timeLeft", `TimeLeft: ${minutes}:${seconds}`);
    set({ isLoading: false });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/start`,
        formData,
        { responseType: "arraybuffer" },
      );
      const responseBlob = new Blob([response.data], { type: "audio/wav" });
      await get().playAudio(responseBlob);
    } catch (error) {
      set({ isLoading: false });
      console.error("Error during transcription:", error);
    }
  },
  endRecording: async () => {
    if (MEDIA_RECORDER) MEDIA_RECORDER.stop();
    set({ isRecording: false });
  },
}));
