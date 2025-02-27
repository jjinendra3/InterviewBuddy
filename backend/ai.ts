import { createGoogleGenerativeAI } from "@ai-sdk/google";
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const GEMINI_1_5_FLASH = google("gemini-2.0-flash-001");
