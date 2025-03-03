import { GEMINI_1_5_FLASH } from "../utils/ai";
import { CoreMessage, generateObject } from "ai";
import { z } from "zod";
import fs from "fs";
import { AI } from "../types/types";
import { getPrompts } from "@/db/dbFunctions";
const schema = z.object({
  speechToText: z.string(),
  reply: z.string(),
  dsaQuestion: z.string().nullable(),
  codeHelp: z.string().nullable(),
});

export const aiGenerator = async (
  round: string,
  text: string,
  history: CoreMessage[],
  timeLeft?: string,
  code?: string,
): Promise<AI | null> => {
  try {
    const audioInput: CoreMessage = {
      role: "user",
      content: text
        ? [
            {
              type: "text",
              text: text,
            },
          ]
        : [
            {
              type: "text",
              text: `TimeLeft: ${timeLeft}`,
            },
            {
              type: "file",
              mimeType: "audio/mpeg",
              data: fs.readFileSync("./recording.webm"),
            },
            {
              type: "text",
              text: `code: ${code}`,
            },
          ],
    };
    const systemInstruction = await getPrompts(round);
    if (!systemInstruction) {
      return null;
    }
    const response = await generateObject({
      model: GEMINI_1_5_FLASH,
      system: systemInstruction,
      messages: [...history, audioInput],
      schema: schema,
    });
    return response.object;
  } catch (error) {
    console.log(error);
    return null;
  }
};
