interface ChatHistoryPart {
  text: string;
}
export interface ChatHistory {
  role: string;
  parts: ChatHistoryPart[];
}
export interface AI {
  speechToText?: string;
  reply?: string;
  dsaQuestion?: string | null;
  codeHelp?: string | null;
}
