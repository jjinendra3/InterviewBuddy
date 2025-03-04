import { getChatHistory, getPrompts } from "@/db/dbFunctions";
import { htmlToPdf } from "@/lib/helpers/generatePDF";
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
    const endInterviewPrompt = await getPrompts("end-interview");
    if (!endInterviewPrompt) {
      return new Response(
        JSON.stringify({
          success: false,
        }),
        { status: 500 },
      );
    }
    const end = await endInterview(endInterviewPrompt, history);
    const response = await htmlToPdf(end);
    return new Response(
      JSON.stringify({
        success: true,
        data: response,
      }),
      { status: 500 },
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
      }),
      { status: 500 },
    );
  }
}
