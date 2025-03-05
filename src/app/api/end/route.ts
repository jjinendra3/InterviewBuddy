// import { getChatHistory, getPrompts } from "@/db/dbFunctions";
// import { htmlToPdf } from "@/lib/helpers/generatePDF";
// import prisma from "@/db/prisma";
// import { GEMINI_1_5_FLASH } from "@/lib/utils/ai";
// import { CoreMessage, generateText } from "ai";
// async function endInterview(systemInstruction: string, history: CoreMessage[]) {
//   const response = await generateText({
//     model: GEMINI_1_5_FLASH,
//     system: systemInstruction,
//     messages: [
//       ...history,
//       {
//         role: "assistant",
//         content: [
//           {
//             type: "text",
//             text: "Use the chat above to make the evaluation report. You have to give the answer in text format but keep the syntax as html but dont use backticks",
//           },
//         ],
//       },
//     ],
//   });
//   return response.text;
// }
export async function POST(req: Request) {
  try {
    const { interviewId } = await req.json();
    console.log(interviewId);
    // const history = await getChatHistory(interviewId);
    // const endInterviewPrompt = await getPrompts("end-interview");
    // if (!endInterviewPrompt) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //     }),
    //     { status: 500 }
    //   );
    // }
    // const end = await endInterview(endInterviewPrompt, history);
    // console.log(end);
    // await prisma.interview.update({
    //   where: {
    //     id: interviewId,
    //   },
    //   data: {
    //     evaluation: end,
    //   },
    // });
    // const end = await prisma.interview.findUnique({
    //   where: {
    //     id: "interviewId",
    //   },
    // });
    // const response = await htmlToPdf(end?.evaluation as string);
    return new Response(
      JSON.stringify({
        success: true,
        data: "https://storage.pdfendpoint.com/096fe2b8-078a-4016-a150-64ead0b7b45a/stable-indigo-mosquito-epqs0w.pdf",
      }),
      { status: 200 },
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
