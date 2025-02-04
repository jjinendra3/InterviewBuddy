import { create } from "zustand";
import axios from "axios";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
interface Store {
  interviewId: string;
  candidateId: string | null;
  round: string | null;
  setInterviewId: (id: string) => void;
  setCandidateId: (id: string) => void;
  startInterview: (
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<Blob>;
  endInterview: () => Promise<boolean>;
}

export const useStore = create<Store>()((set) => ({
  interviewId: "",
  candidateId: null,
  setInterviewId: (id) => set({ interviewId: id }),
  setCandidateId: (id) => set({ candidateId: id }),
  round: null,
  startInterview: async (
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setIsLoading(true);
    const response = await axios.post(`${BACKEND}/interview`, {
      round: "google-hr",
      candidate: "15234",
    });
    localStorage.setItem("interviewId", response.data.id);
    set({ interviewId: response.data.id });
    set({ candidateId: response.data.candidateId });
    set({ round: response.data.round });
    const formData = new FormData();
    formData.append("interviewId", response.data.id);
    formData.append("timeLeft", "TimeLeft: 10:00");
    formData.append("text", "Hello, My name is Alex");
    const firstAudio = await axios.post(`${BACKEND}/transcribe`, formData, {
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
      const response = await axios.get(`${BACKEND}/end/{interviewId}`, {
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
}));
