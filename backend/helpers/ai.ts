import { interviewRound } from "./interviewRound";
import { GEMINI_1_5_FLASH } from "../ai";
import { generateObject, type CoreUserMessage } from "ai";
import { z } from "zod";
import { AI } from "../type/types";
const fs = require("fs");

const schema = z.object({
  speechToText: z.string(),
  reply: z.string(),
});
const DsaSchema = z.object({
  speechToText: z.string(),
  reply: z.string(),
  dsaQuestion: z.string().nullable(),
  codeHelp: z.string().nullable(),
});

export const useAi = async (
  round: string,
  text: string,
  history: CoreUserMessage[],
  timeLeft?: string,
): Promise<AI> => {
  try {
    const audioInput: CoreUserMessage = {
      role: "user",
      content: text
        ? text
        : [
            {
              type: "text",
              text: `TimeLeft: ${timeLeft}`,
            },
            {
              type: "file",
              mimeType: "audio/mpeg",
              data: fs.readFileSync("./uploads/recording.webm"),
            },
          ],
    };
    const roundPath = await interviewRound("google-hr");
    const systemInstruction = fs.readFileSync(roundPath, "utf8");
    const response = await generateObject({
      model: GEMINI_1_5_FLASH,
      system: systemInstruction,
      messages: [...history, audioInput],
      schema: schema,
    });
    return { dsaQuestion: null, codeHelp: null, ...response.object };
  } catch (error) {
    console.log(error);
  }
};

export const useDsaAi = async (
  round: string,
  text: string,
  history: CoreUserMessage[],
  timeLeft?: string,
  code?: string,
) => {
  try {
    const audioInput: CoreUserMessage = {
      role: "user",
      content: text
        ? text
        : [
            {
              type: "text",
              text: `TimeLeft: ${timeLeft}`,
            },
            {
              type: "file",
              mimeType: "audio/mpeg",
              data: fs.readFileSync("./uploads/recording.webm"),
            },
            {
              type: "text",
              text: `Code: "${code}"`,
            },
          ],
    };
    const roundPath = await interviewRound("google-tech");
    const systemInstruction = fs.readFileSync(roundPath, "utf8");
    const response = await generateObject({
      model: GEMINI_1_5_FLASH,
      system: systemInstruction,
      messages: [...history, audioInput],
      schema: DsaSchema,
    });
    return response.object;
  } catch (error) {
    console.log(error);
  }
};
