import { GEMINI_1_5_FLASH } from "../utils/ai";
import { CoreMessage, generateObject } from "ai";
import { z } from "zod";
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
  file: ArrayBuffer | null,
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
        : file
          ? [
              {
                type: "file",
                mimeType: "audio/mpeg",
                data: file,
              },
              {
                type: "text",
                text: `code: ${code}`,
              },
            ]
          : "",
    };
    const systemInstruction = await getPrompts(round);
    if (!systemInstruction) {
      return null;
    }
    const response = await generateObject({
      model: GEMINI_1_5_FLASH,
      system: systemInstruction,
      messages: [
        ...history,
        {
          role: "assistant",
          content: [
            {
              type: "text",
              text: `TimeLeft: ${timeLeft}`,
            },
          ],
        },
        audioInput,
      ],
      schema: schema,
    });
    return response.object;
  } catch (error) {
    console.log(error);
    return null;
  }
};
