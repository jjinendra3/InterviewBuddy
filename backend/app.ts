import { useAi } from "./ai";
import { transcribeFile } from "./transcribe";
import { getAudio } from "./speech";
import { randomUUID } from "crypto";
const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 5000;
import {
  createInterview,
  saveToDbModel,
  saveToDbUser,
  getChatHistory,
} from "./db/saveToDb";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.post("/interview", async (req, res) => {
  try {
    const candidateId = randomUUID();
    //TODO: FIX WHEN AUTHENTICATION IS IMPLEMENTED
    const round = "google-hr"; //req.body.round;
    const response = await createInterview(round, candidateId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/transcribe", upload, async (req, res) => {
  try {
    const interviewId = req.body.interviewId;
    const timeLeft = req.body.timeLeft ?? "";
    const text = req.body.text;
    const response = text == null ? await transcribeFile() : text;
    const history = await getChatHistory(interviewId);
    const textGen = await useAi(response + timeLeft, history);
    await getAudio(textGen);
    const outputAudio = path.join(__dirname, "output.wav");
    if (!fs.existsSync(outputAudio)) throw "Not Found!";
    await saveToDbUser(response, interviewId);
    await saveToDbModel(textGen, interviewId);
    return res.status(200).sendFile(outputAudio);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .sendFile(path.join(__dirname, "audio_files/error.wav"));
  }
});

app.head("/wake-up", (req, res) => {
  return res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
