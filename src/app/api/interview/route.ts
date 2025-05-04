import { getChatHistory, saveToDbModel, saveToDbUser } from "@/db/dbFunctions";
import { aiGenerator } from "@/lib/helpers/aiGenerator";
import { getAudio } from "./helpers/speech";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const arrayBuffer = file ? await file.arrayBuffer() : null;
    const interviewId = formData.get("interviewId") as string;
    const timeLeft = formData.get("timeLeft") as string;
    const text = formData.get("text") as string;
    const round = formData.get("round") as string;
    if (!interviewId || !timeLeft || !round) {
      return new Response("Missing parameters", { status: 500 });
    }
    const history = await getChatHistory(interviewId);
    const textGen = await aiGenerator(
      round,
      text,
      history,
      arrayBuffer,
      timeLeft
    );
    if (!textGen?.reply || !textGen?.speechToText) {
      return new Response("Error in reponse", { status: 500 });
    }
    const audio = await getAudio(textGen.reply);
    if (!audio) throw "Not Found!";
    await saveToDbUser(textGen.speechToText, interviewId);
    await saveToDbModel(textGen.reply, interviewId);
    const audioBase64 = audio.toString("base64");
    const response = {
      audio: audioBase64,
      dsaQuestion: textGen.dsaQuestion,
      codeHelp: textGen.codeHelp,
      reply: textGen.reply,
    };
    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch {
    const audioBuffer = fs.readFileSync("/sound/error.wav");
    const audioBase64 = audioBuffer.toString("base64");
    const response = {
      audio: audioBase64,
      dsaQuestion: null,
      codeHelp: null,
      reply: null,
    };
    return new Response(JSON.stringify(response), {
      status: 500,
    });
  }
}
