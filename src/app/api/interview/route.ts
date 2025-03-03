import { getChatHistory, saveToDbModel, saveToDbUser } from "@/db/dbFunctions";
import { aiGenerator } from "@/lib/helpers/aiGenerator";
import { getAudio } from "./helpers/speech";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    if (!file) {
      return new Response("No file found", { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    fs.writeFileSync(`./${file.name}`, buffer);
    const interviewId = formData.get("interviewId") as string;
    const timeLeft = formData.get("timeLeft") as string;
    const text = formData.get("text") as string;
    const round = formData.get("round") as string;
    if (!interviewId || !timeLeft || !text || !round) {
      return new Response("Missing parameters", { status: 500 });
    }
    const history = await getChatHistory(interviewId);
    const textGen = await aiGenerator(round, text, history, timeLeft);
    if (!textGen?.reply || !textGen?.speechToText) {
      return new Response("Error in reponse", { status: 500 });
    }
    await getAudio(textGen.reply);
    const outputAudio = path.join(__dirname, "./helpers/output.wav");

    if (!fs.existsSync(outputAudio)) throw "Not Found!";
    await saveToDbUser(textGen.speechToText, interviewId);
    await saveToDbModel(textGen.reply, interviewId);

    const audioBuffer = fs.readFileSync(outputAudio);
    const audioBase64 = audioBuffer.toString("base64");

    const response = {
      audio: audioBase64,
      dsaQuestion: textGen.dsaQuestion,
      codeHelp: textGen.codeHelp,
      reply: textGen.reply,
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    const audioBuffer = fs.readFileSync("./helpers/error.wav");
    const audioBase64 = audioBuffer.toString("base64");
    const response = {
      audio: audioBase64,
      dsaQuestion: null,
      codeHelp: null,
      reply: null,
    };
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
