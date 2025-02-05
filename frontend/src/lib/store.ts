import { create } from "zustand";
import { type Store } from "./types";
import axios from "axios";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
export const useStore = create<Store>()((set) => ({
  jwt: null,
  interviewId: null,
  candidate: null,
  setInterviewId: (id) => set({ interviewId: id }),
  setCandidate: (id, name, email) =>
    set({
      candidate: { id: id, name: name, email: email },
    }),
  round: null,
  startInterview: async (
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setIsLoading(true);
    const response = await axios.post(`${BACKEND}/start`, {
      round: "google-hr",
      candidate: "15234",
    });
    localStorage.setItem("interviewId", response.data.id);
    set({ interviewId: response.data.id });
    set({ round: response.data.round });
    const formData = new FormData();
    formData.append("interviewId", response.data.id);
    formData.append("timeLeft", "TimeLeft: 10:00");
    formData.append("text", "Hello, My name is Alex");
    const firstAudio = await axios.post(`${BACKEND}/meet`, formData, {
      responseType: "arraybuffer",
    });

    const audioBlob = new Blob([firstAudio.data], { type: "audio/wav" });
    setIsLoading(false);
    return audioBlob;
  },
  endInterview: async () => {
    try {
      const interviewId = localStorage.getItem("interviewId");
      if (!interviewId) return false;
      localStorage.removeItem("interviewId");
      const response = await axios.get(`${BACKEND}/end/${interviewId}`, {
        responseType: "blob",
      });
      if (response.status === 500) {
        return false;
      }
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
  signup: async (email: string, name: string, password: string) => {
    try {
      const response = await axios.post(`${BACKEND}/auth/signup`, {
        email,
        name,
        password,
      });
      if (response.status === 400) throw new Error(response.data.error);
      return { message: response.data.message as string, success: true };
    } catch (error) {
      return { message: error as string, success: false };
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BACKEND}/auth/login`, {
        email,
        password,
      });
      if (response.status === 401) throw new Error(response.data.error);
      set({
        jwt: response.data.token,
      });
      set({
        candidate: {
          email: response.data.user.email,
          id: response.data.user.uid,
          name: response.data.user.name,
        },
      });
      return { message: response.data.message as string, success: true };
    } catch (error) {
      return { message: error as string, success: false };
    }
  },
}));
