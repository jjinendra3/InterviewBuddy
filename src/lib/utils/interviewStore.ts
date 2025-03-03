import axios from "axios";
import { create } from "zustand";
import { InterviewStore } from "./types";
import { generalStore } from "./generalStore";
import { convertBase64ToAudioWithPackage } from "./base64toBlob";

const VOICE_MIN_DECIBELS = -60;
const DELAY_BETWEEN_DIALOGS = 3000;
const DIALOG_MAX_LENGTH = 60000;
//eslint-disable-next-line
let MEDIA_RECORDER: any = null;
const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

export const interviewStore = create<InterviewStore>()((set, get) => ({
  isRecording: false,
  aiSpeaking: false,
  isLoading: false,
  seconds: null,
  minutes: null,
  dsaQuestion: null,
  setSeconds: (seconds: number | null) => set({ seconds }),
  setMinutes: (minutes: number | null) => set({ minutes }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setAiSpeaking: (speaking: boolean) => set({ aiSpeaking: speaking }),
  setIsRecording: (recording: boolean) => set({ isRecording: recording }),
  playPing: async () => {
    const audio = new Audio("/sound/ping.mp3");
    await audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  },
  startInterview: async (round: string) => {
    try {
      if (!generalStore.getState().candidate?.id)
        throw new Error("User not found");
      const response = await axios.post(`${BACKEND}/start`, {
        round: round,
        userId: generalStore.getState().candidate?.id,
      });
      if (response.status === 500) throw new Error("Candidate not found");
      generalStore.getState().setInterviewId(response.data.id);
      generalStore.getState().setRound("google-hr");
      const formData = new FormData();
      formData.append("interviewId", response.data.id);
      formData.append("timeLeft", "TimeLeft: 10:00");
      formData.append(
        "text",
        `Hello, My name is ${generalStore.getState().candidate?.name}`,
      );
      formData.append("round", round);
      const firstAudio = await axios.post(`${BACKEND}/meet`, formData);
      const audioBlob = convertBase64ToAudioWithPackage(firstAudio.data.audio);
      generalStore.getState().setStartAudio(audioBlob);
      return response.data.id;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  endInterview: async () => {
    try {
      if (!generalStore.getState().candidate) return false;
      const interviewId = generalStore.getState().interviewId;
      if (!interviewId) return false;
      generalStore.getState().setInterviewId(null);
      const response = await axios.get(`${BACKEND}/end/${interviewId}`, {
        responseType: "blob",
      });
      if (response.status === 500) return false;
      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "EvaluationReport.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      return true;
    } catch (error) {
      console.error("PDF download error:", error);
      return false;
    }
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
    const interviewId = await localStorage.getItem("interviewId ");
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
    set({ isLoading: true });

    try {
      const firstAudio = await axios.post(`${BACKEND}/meet`, formData);
      const audioBlob = convertBase64ToAudioWithPackage(firstAudio.data.audio);
      get().playAudio(audioBlob);
    } catch (error) {
      console.error("Error during transcription:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  endRecording: async () => {
    if (MEDIA_RECORDER) MEDIA_RECORDER.stop();
    set({ isRecording: false });
  },
}));
