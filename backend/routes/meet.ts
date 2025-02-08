import { Router } from "express";
import { getAudio } from "../helpers/speech";
import { transcribeFile } from "../helpers/transcribe";
const path = require("path");
const fs = require("fs");
const multer = require("multer");
import { useAi } from "../helpers/ai";
import { saveToDbModel, saveToDbUser, getChatHistory } from "../db/saveToDb";
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
    const interviewId = req.body.interviewId;
    const timeLeft = req.body.timeLeft ?? "";
    const text = req.body.text;
    const round = req.body.round;
    const response = text == null ? await transcribeFile() : text;
    const history = await getChatHistory(interviewId);
    const textGen = await useAi(round, response + timeLeft, history);
    await getAudio(textGen);
    const outputAudio = path.join(__dirname, "../output.wav");
    if (!fs.existsSync(outputAudio)) throw "Not Found!";
    await saveToDbUser(response, interviewId);
    await saveToDbModel(textGen, interviewId);
    return res.status(200).sendFile(outputAudio);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .sendFile(path.join(__dirname, "../audio_files/error.wav"));
  }
});
module.exports = app;
