
import { ChatHistory } from "../type/types";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const systemInstruction = fs.readFileSync(
  process.env.PROMPT_PATH, //TODO: Configure for different company and rounds
  "utf8",
);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemInstruction,
});
export const useAi = async (text: string, history: ChatHistory[]) => {
  try {
    const chat = model.startChat({
      history: history,
    });
    const result = await chat.sendMessage(text);
    return result.response.text();
  } catch (error) {
    console.log(error);
  }
};
