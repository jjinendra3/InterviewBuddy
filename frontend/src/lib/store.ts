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
}));
