interface ChatHistoryPart {
  text: string;
}
export interface chatHistory {
  role: string;
  parts: ChatHistoryPart[];
}
