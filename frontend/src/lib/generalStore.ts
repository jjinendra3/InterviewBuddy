import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export const generalStore = create<GeneralStore>()(
  persist(
    (set, get) => ({
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
        try {
          if (!auth.currentUser && !get().candidate?.id)
            throw new Error("User not found");
          console.log(get().candidate?.id);
          const response = await axios.post(`${BACKEND}/start`, {
            round: "google-hr",
            userId: get().candidate?.id,
          });
          if (response.status === 500) throw new Error("Candidate not found");
          set({ interviewId: response.data.id, round: response.data.round });
          const formData = new FormData();
          formData.append("interviewId", response.data.id);
          formData.append("timeLeft", "TimeLeft: 10:00");
          formData.append("text", `Hello, My name is ${get().candidate?.name}`);
          const firstAudio = await axios.post(`${BACKEND}/meet`, formData, {
            responseType: "blob",
          });
          const jsonResponse = firstAudio.headers["json"];
          console.log(JSON.parse(jsonResponse));
          set({ startAudio: firstAudio.data });
          return response.data.id;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
      endInterview: async () => {
        try {
          if (!auth.currentUser) return false;
          const interviewId = get().interviewId;
          if (!interviewId) return false;
          set({ interviewId: null });
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
      signup: async (email, name, password) => {
        try {
          const response = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = await axios.post(`${BACKEND}/user`, {
            email,
            name,
            uid: response.user.uid,
          });
          set({
            candidate: {
              id: user.data.uid,
              name: user.data.name,
              email: user.data.email,
            },
          });
          return { message: "User SignUp Successful!", success: true };
        } catch (error) {
          return { message: error!.toString(), success: false };
        }
      },
      login: async (email, password) => {
        try {
          const response = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = await axios.get(`${BACKEND}/user/${response.user.uid}`);
          if (!user) throw new Error("User not found");
          set({
            candidate: {
              id: user.data.uid,
              name: user.data.name,
              email: user.data.email,
            },
          });
          return { message: "User Login Successful!", success: true };
        } catch (error) {
          return { message: error!.toString(), success: false };
        }
      },
      loginWithGoogle: async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const authUser = result.user;
          if (!authUser)
            return { message: "User not found through Google", success: false };
          const userExists = await axios.post(`${BACKEND}/user`, {
            email: authUser?.email,
            name: authUser?.displayName,
            uid: authUser?.uid,
          });
          const { user } = userExists.data;
          if (!userExists) {
            await get().logout();
            throw new Error("User not found");
          }
          set({
            candidate: {
              id: user.uid,
              name: user.name,
              email: user.email,
            },
          });
          console.log(get().candidate);
          return { message: "User Login Successful!", success: true };
        } catch (error) {
          console.log("briihhh");
          await get().logout();
          toaster(error!.toString());
          return { message: error!.toString(), success: false };
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
                id: user.uid,
                name: user.displayName || "",
                email: user.email || "",
              },
            });
          });
          return { message: "User Login Successful!", success: true };
        } catch (error) {
          console.error(error);
          return { message: error!.toString(), success: false };
        }
      },
      logout: async () => {
        try {
          await auth.signOut();
          set({ candidate: null, interviewId: null });
          return { message: "User Logout Successful!", success: true };
        } catch (error) {
          return { message: error!.toString(), success: false };
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        candidate: state.candidate,
      }),
    }
  )
);
