import { create } from "zustand";
import { type GeneralStore } from "./types";
import axios from "axios";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import { toaster } from "@/components/toast";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

export const useStore = create<GeneralStore>()((set, get) => ({
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
    if (!auth.currentUser && !get().candidate) return;
    const response = await axios.post(`${BACKEND}/start`, {
      round: "google-hr",
      candidate: get().candidate?.id,
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
      if (!auth.currentUser) return false;
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
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = await axios.post(`${BACKEND}/user`, {
        email: email,
        name: name,
        uid: response.user.uid,
      });
      if (!user) throw new Error("User not created");
      return { message: "User SignUp Successful!" as string, success: true };
    } catch (error) {
      return { message: error as string, success: false };
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = await axios.get(`${BACKEND}/user/${response.user.uid}`);
      if (!user) throw new Error("User not found");
      set({
        candidate: {
          id: user.data.id,
          name: user.data.name,
          email: user.data.email,
        },
      });
      return { message: "User Login Successful!" as string, success: true };
    } catch (error) {
      return { message: error as string, success: false };
    }
  },
  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider); //does both sign in and signup.
      await onAuthStateChanged(auth, async (user) => {
        if (!user) return;
        const userExists = await axios.post(`${BACKEND}/user`, {
          email: user?.email,
          name: user?.displayName,
          uid: user?.uid,
        });
        set({
          candidate: {
            id: userExists.data.id,
            name: userExists.data.name,
            email: userExists.data.email,
          },
        });
      });
      return { message: "User Login Successful!" as string, success: true };
    } catch (error) {
      toaster(error as string);
      return { message: error as string, success: false };
    }
  },
  loginWithGitHub: async () => {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("user:email");
      await signInWithPopup(auth, provider);
      await onAuthStateChanged(auth, async (user) => {
        if (!user) return;
        set({
          candidate: {
            id: user?.uid,
            name: user?.displayName ?? "",
            email: user?.email ?? "",
          },
        });
      });
      return { message: "User Login Successful!" as string, success: true };
    } catch (error) {
      console.error(error);
      return { message: `${error}` as string, success: false };
    }
  },
  logout: async () => {
    try {
      await auth.signOut();
      return { message: "User Logout Successful!" as string, success: true };
    } catch (error) {
      return { message: error as string, success: false };
    }
  },
}));
