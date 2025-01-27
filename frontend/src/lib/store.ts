import { create } from "zustand";
import axios from "axios";

interface Store {
  interviewId: string | null;
  candidateId: string | null;
  round: string;
  setInterviewId: (id: string) => void;
  setCandidateId: (id: string) => void;
  startInterview: (
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<Blob>;
}

export const useStore = create<Store>()((set) => ({
  interviewId: null,
  candidateId: null,
  setInterviewId: (id) => set({ interviewId: id }),
  setCandidateId: (id) => set({ candidateId: id }),
  round: "null",
  startInterview: async (
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setIsLoading(true);
    const response = await axios.post("http://localhost:5000/interview", {
      round: "google-hr",
      candidate: "1234",
    });
    set({ interviewId: response.data.id });
    set({ candidateId: response.data.candidateId });
    set({ round: response.data.round });
    const firstAudio = await axios.post("http://localhost:5000/transcribe", {
      interviewId: response.data.id,
      timeLeft: "TimeLeft: 10:00",
      text: "Hello",
    });
    setIsLoading(false);
    return firstAudio.data;
  },
}));
