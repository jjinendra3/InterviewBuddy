import { useAi } from "./ai";
import { transcribeFile } from "./transcribe";
import { getAudio } from "./speech";
const express = require("express");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 5000;

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

app.post("/transcribe", upload, async (req, res) => {
  try {
    const response = await transcribeFile();
    console.log(response);
    const textGen = await useAi(response);
    console.log("Text generated:", textGen);
    await getAudio(textGen);
    const outputAudio = path.join(__dirname, "output.wav");
    if (!fs.existsSync(outputAudio)) throw "Not Found!";
    return res.sendFile(outputAudio);
  } catch (error) {
    return res.sendFile(path.join(__dirname, "audio_files/error.wav"));
    //TODO: SEND A SUCCESS BOOL AS WELL TO TAKE STEPS IN FRONTEND!
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
