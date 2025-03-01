import { Router } from "express";
import { getAudio } from "../helpers/speech";
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const formData = require("form-data");
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
    //  todo: fix this when meet gets started
    const { interviewId, timeLeft, text, round } = req.body;
    const history = await getChatHistory(interviewId);
    const textGen: AI = round.includes("tech")
      ? await useDsaAi(round, text, timeLeft, history)
      : await useAi(round, text, timeLeft, history);
    await getAudio(textGen.reply);
    const outputAudio = path.join(__dirname, "../output.wav");
    if (!fs.existsSync(outputAudio)) throw "Not Found!";
    await saveToDbUser(textGen.speechToText, interviewId);
    await saveToDbModel(textGen.reply, interviewId);

    const form = new formData();

    const audioBuffer = fs.readFileSync(outputAudio);
    const audioBlob = new Blob([audioBuffer], { type: "audio/wav" });

    form.append("audio", audioBlob);

    const jsonResponse = {
      dsaQuestion: textGen.dsaQuestion,
      codeHelp: textGen.codeHelp,
      reply: textGen.reply,
    };
    form.append("json", JSON.stringify(jsonResponse));

    res.setHeader(
      "Content-Type",
      "multipart/form-data; boundary=" + form.getBoundary(),
    );
    return form.pipe(res);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .sendFile(path.join(__dirname, "../audio_files/error.wav"));
  }
});
module.exports = app;
