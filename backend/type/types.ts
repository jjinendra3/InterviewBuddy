interface ChatHistoryPart {
  text: string;
}
export interface ChatHistory {
  role: string;
  parts: ChatHistoryPart[];
}
