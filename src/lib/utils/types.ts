interface Candidate {
  id: string;
  name: string;
  email: string;
}
interface Auth {
  message: string;
  success: boolean;
}
export type GeneralStore = {
  interviewId: string | null;
  candidate: Candidate | null;
  round: string | null;
  startAudio: Blob | null;

  setRound: (round: string) => void;
  setStartAudio: (audio: Blob | null) => void;
  setInterviewId: (id: string | null) => void;
  setCandidate: (id: string, name: string, email: string) => void;

  // signup: (email: string, name: string, password: string) => Promise<Auth>;
  // login: (email: string, password: string) => Promise<Auth>;
  logout: () => Promise<Auth>;
  loginWithGoogle: () => Promise<Auth>;
  // loginWithGitHub: () => Promise<Auth>;

  rehydrateState?: () => void;
};

type InterviewID = {
  success: boolean;
  id: string;
};
export type InterviewStore = {
  isRecording: boolean;
  aiSpeaking: boolean;
  isLoading: boolean;
  seconds: string | null;
  minutes: string | null;
  subtitles: string | null;
  setSubtitles: (subtitles: string | null) => void;
  startInterview: (round: string) => Promise<InterviewID>;
  endInterview: () => Promise<string | null>;
  setSeconds: (seconds: string | null) => void;
  setMinutes: (minutes: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setAiSpeaking: (speaking: boolean) => void;
  setIsRecording: (recording: boolean) => void;
  playPing: () => Promise<void>;
  startRecording: () => void;
  stopRecording: () => void;
  record: () => void;
  playAudio: (audioBlob: Blob) => void;
  sendAudio: (audioBlob: Blob) => void;
  endRecording: () => void;
};
