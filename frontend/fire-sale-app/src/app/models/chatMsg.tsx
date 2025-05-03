export interface ChatMessage {
    id: number;
    text: string;
    sender: "me" | "them" | "ai";
    time: string;
  }