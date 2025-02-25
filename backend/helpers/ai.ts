import { interviewRound } from "./interviewRound";
import { GEMINI_1_5_FLASH } from "../ai";
import { generateObject, type CoreUserMessage } from "ai";
import { z } from "zod";
const fs = require("fs");

const schema = z.object({
  speechToText: z.string(),
  reply: z.string(),
});

export const useAi = async (
  round: string,
  text: string,
  history: CoreUserMessage[],
  timeLeft?: string,
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
    return response.object;
  } catch (error) {
    console.log(error);
  }
};
