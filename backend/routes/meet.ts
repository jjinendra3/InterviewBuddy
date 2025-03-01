import { Router } from "express";
import { getAudio } from "../helpers/speech";
const path = require("path");
const fs = require("fs");
const multer = require("multer");
import { useAi, useDsaAi } from "../helpers/ai";
import { saveToDbModel, saveToDbUser, getChatHistory } from "../db/saveToDb";
import { AI } from "../type/types";
const app = Router();
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).fields([
  { name: "file" },
  { name: "audio" },
]);

app.post("/", upload, async (req, res) => {
  try {
    const { interviewId, timeLeft, text, round } = req.body;
    const history = await getChatHistory(interviewId);
    const textGen: AI = await useAi(round, text, history, timeLeft);
    await getAudio(textGen.reply);
    const outputAudio = path.join(__dirname, "../output.wav");
    if (!fs.existsSync(outputAudio)) throw "Not Found!";
    await saveToDbUser(textGen.speechToText, interviewId);
    await saveToDbModel(textGen.reply, interviewId);

    const audioBuffer = fs.readFileSync(outputAudio);
    const audioBase64 = audioBuffer.toString("base64");
    return res.json({
      audio: `data:audio/wav;base64,${audioBase64}`,
      dsaQuestion: textGen.dsaQuestion,
      codeHelp: textGen.codeHelp,
      reply: textGen.reply,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .sendFile(path.join(__dirname, "../audio_files/error.wav"));
  }
});
module.exports = app;
