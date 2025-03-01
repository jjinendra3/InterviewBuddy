interface Candidate {
  id: string;
  name: string;
  email: string;
}
interface Auth {
  message: string;
  success: boolean;
}
export interface GeneralStore {
  interviewId: string | null;
  candidate: Candidate | null;
  round: string | null;
  startAudio: Blob | null;

  setStartAudio: (audio: Blob | null) => void;
  setInterviewId: (id: string) => void;
  setCandidate: (id: string, name: string, email: string) => void;

  startInterview: () => Promise<string>;
  endInterview: () => Promise<boolean>;

  signup: (email: string, name: string, password: string) => Promise<Auth>;
  login: (email: string, password: string) => Promise<Auth>;
  logout: () => Promise<Auth>;
  loginWithGoogle: () => Promise<Auth>;
  loginWithGitHub: () => Promise<Auth>;

  rehydrateState?: () => void;
}

export interface InterviewStore {
  isRecording: boolean;
  aiSpeaking: boolean;
  isLoading: boolean;
  seconds: number | null;
  minutes: number | null;
  setSeconds: (seconds: number | null) => void;
  setMinutes: (minutes: number | null) => void;
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
}
