import { getChatHistory } from "@/db/dbFunctions";
import { GEMINI_1_5_FLASH } from "@/lib/utils/ai";

import { CoreMessage, generateText } from "ai";
async function endInterview(systemInstruction: string, history: CoreMessage[]) {
  const response = await generateText({
    model: GEMINI_1_5_FLASH,
    system: systemInstruction,
    messages: history,
  });
  return response.text;
}
export async function POST(req: Request) {
  try {
    const { interviewId } = await req.json();
    const history = await getChatHistory(interviewId);
    const endInterviewPrompt = "as";
    const end = await endInterview(endInterviewPrompt, history);
    console.log(end);
    // await pdfGenerator(end);
    return new Response("Yes", { status: 500 });
  } catch {
    return new Response("No", { status: 500 });
  }
}
