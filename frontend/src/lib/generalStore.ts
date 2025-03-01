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
      setRound: (round) => set({ round }),
      signup: async (email, name, password) => {
        try {
          const response = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
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
            password,
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
    },
  ),
);
