import { create } from "zustand";
import type { Conversation, InterviewStore } from "./types";
import { generalStore } from "./generalStore";
import { convertBase64ToAudioWithPackage } from "./base64toBlob";

const VOICE_MIN_DECIBELS = -60;
const DELAY_BETWEEN_DIALOGS = 1500;
const DIALOG_MAX_LENGTH = 30000;
//eslint-disable-next-line
let MEDIA_RECORDER: any = null;

export const interviewStore = create<InterviewStore>()((set, get) => ({
  isRecording: false,
  aiSpeaking: false,
  isLoading: false,
  seconds: null,
  minutes: null,
  dsaQuestion: null,
  subtitles: null,
  conversation: [
    {
      role: "system",
      content: `You are an AI assistant for a mock interview platform. You will ask the user questions and respond to their answers. You will also provide feedback on their performance.`,
    },
  ],
  setConversation: (conversation: Conversation[]) => set({ conversation }),
  setSubtitles: (subtitles: string | null) => set({ subtitles }),
  setSeconds: (seconds: string | null) => set({ seconds }),
  setMinutes: (minutes: string | null) => set({ minutes }),
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
      const candidate = generalStore.getState().candidate;
      if (!candidate?.id) throw new Error("User not found");

      const response = await fetch("/api/start-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          round: round,
          userId: candidate?.id,
        }),
      });
      const res = await response.json();
      if (res.status === 500) throw new Error("Candidate not found");
      generalStore.getState().setInterviewId(res.id);
      generalStore.getState().setRound(res.round);
      const formData = new FormData();
      formData.append("interviewId", res.id);
      formData.append("timeLeft", "TimeLeft: 10:00");
      formData.append(
        "text",
        `Hello, My name is ${generalStore.getState().candidate?.name}`
      );
      formData.append("round", round);
      const firstAudio = await fetch("/api/interview", {
        method: "POST",
        body: formData,
      });
      const data = await firstAudio.json();
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
        { type: "audio/wav" }
      );
      generalStore.getState().setStartAudio(audioBlob);
      set({ subtitles: data.reply });
      return {
        success: true,
        id: res.id,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        id: "",
      };
    }
  },
  endInterview: async () => {
    try {
      if (!generalStore.getState().candidate) return null;
      const interviewId = generalStore.getState().interviewId;
      if (!interviewId) return null;
      console.log("Ending interview", interviewId);
      generalStore.getState().setInterviewId(null);
      await MEDIA_RECORDER.stop();
      const response = await fetch(`/api/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewId: interviewId,
        }),
      });
      const data = await response.json();
      if (response.status === 500) return null;
      console.log(data);
      return data.data as string;
    } catch (error) {
      console.error("PDF download error:", error);
      return null;
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
    const interviewId = generalStore.getState().interviewId;
    const seconds = get().seconds;
    const minutes = get().minutes;
    console.log("Sending audio to server", interviewId, minutes, seconds);

    if (!audioBlob || !interviewId) {
      get().startRecording();
      return;
    }
    console.log("Sending audio to server", interviewId, minutes, seconds);
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("interviewId", interviewId);
    formData.append("timeLeft", `TimeLeft: ${minutes}:${seconds}`);
    formData.append("round", "google-hr");
    set({ isLoading: true });

    try {
      const firstAudio = await fetch("/api/interview", {
        method: "POST",
        body: formData,
      });
      const data = await firstAudio.json();
      set({ subtitles: data.reply });
      const audioBlob = convertBase64ToAudioWithPackage(data.audio);
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
