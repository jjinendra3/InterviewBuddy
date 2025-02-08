interface Candidate {
  id: string;
  name: string;
  email: string;
}
interface Auth {
  message: string;
  success: boolean;
}
export interface Store {
  jwt: string | null;
  interviewId: string | null;
  candidate: Candidate | null;
  round: string | null;
  startAudio: Blob | null;
  setStartAudio: (audio: Blob | null) => void;
  setInterviewId: (id: string) => void;
  setCandidate: (id: string, name: string, email: string) => void;
  startInterview: () // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  => Promise<string>;
  endInterview: () => Promise<boolean>;
  signup: (email: string, name: string, password: string) => Promise<Auth>;
  login: (email: string, password: string) => Promise<Auth>;
}
