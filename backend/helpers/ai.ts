import { ChatHistory } from "../type/types";
import { interviewRound } from "./interviewRound";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const useAi = async (
  round: string,
  text: string,
  history: ChatHistory[],
) => {
  try {
    const roundPath = await interviewRound("google-hr");
    const systemInstruction = fs.readFileSync(roundPath, "utf8");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });
    const chat = model.startChat({
      history: history,
    });
    const result = await chat.sendMessage(text);
    return result.response.text();
  } catch (error) {
    console.log(error);
  }
};
