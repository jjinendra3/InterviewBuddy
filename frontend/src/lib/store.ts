import { create } from "zustand";
import { type GeneralStore } from "./types";
import axios from "axios";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
export const useStore = create<GeneralStore>()((set, get) => ({
  jwt: null,
  interviewId: null,
  candidate: null,
  startAudio: null,
  setStartAudio: (audio) => set({ startAudio: audio }),
  setInterviewId: (id) => set({ interviewId: id }),
  setCandidate: (id, name, email) =>
    set({
      candidate: { id: id, name: name, email: email },
    }),
  round: null,
  startInterview: async () => {
    if (!get().candidate?.email) return;
    const response = await axios.post(`${BACKEND}/start`, {
      round: "google-hr",
      candidate: get().candidate?.email,
    });
    localStorage.setItem("interviewId", response.data.id);
    set({ interviewId: response.data.id });
    set({ round: response.data.round });
    const formData = new FormData();
    formData.append("interviewId", response.data.id);
    formData.append("timeLeft", "TimeLeft: 10:00");
    formData.append("text", `Hello, My name is ${get().candidate?.name}`);
    const firstAudio = await axios.post(`${BACKEND}/meet`, formData, {
      responseType: "arraybuffer",
    });

    const audioBlob = new Blob([firstAudio.data], { type: "audio/wav" });
    set({ startAudio: audioBlob });
    return response.data.id;
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
    // try {
    //   const { error } = await supabase.auth.signUp({
    //     email: email,
    //     password: password,
    //     options: {
    //       data: {
    //         name: name,
    //       },
    //     },
    //   });
    //   if (error) throw new Error(error.message);
    //   return { message: "User SignUp Successful!" as string, success: true };
    // } catch (error) {
    //   return { message: error as string, success: false };
    // }
  },
  login: async (email: string, password: string) => {
    // try {
    //   const { data, error } = await supabase.auth.signInWithPassword({
    //     email: email,
    //     password: password,
    //   });
    //   if (error) throw error.message;
    //   set({
    //     jwt: data.session.access_token,
    //   });
    //   const session = await supabase.auth.getSession();
    //   console.log(session.data);
    //   const response = await supabase.auth.getUser(data.session.access_token);
    //   console.log(response.data, response.error);
    //   // if (token) {
    //   // }
    //   set({
    //     candidate: {
    //       email: data.user.email ?? "",
    //       id: data.user.id,
    //       name: data.user.user_metadata.full_name,
    //     },
    //   });
    //   return { message: "Logged In!" as string, success: true };
    // } catch (error) {
    //   return { message: error as string, success: false };
    // }
  },
  logout: async () => {
    // try {
    //   const { error } = await supabase.auth.signOut();
    //   if (error) throw error.message;
    // } catch (error) {
    //   return error;
    // }
  },
}));
