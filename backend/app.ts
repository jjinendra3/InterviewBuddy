import { useAi } from "./ai";
import { transcribeFile } from "./transcribe";
import { getAudio } from "./speech";
import prisma from "./prisma";
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

app.get("/user", async (req, res) => {
  try {
    const response = await prisma.interview.create({
      data: {
        round: "google-hr",
        candidateId: "brsuh",
      },
    });
    const text = await useAi("Hello" + "TimeLeft:10:00", []);
    prisma.conversation.create({
      data: {
        role: "user",
        text: "Hello",
        interviewId: response.id,
      },
    });
    prisma.conversation.create({
      data: {
        role: "model",
        text: text,
        interviewId: response.id,
      },
    });
    return res.status(200).send({ text: text, response: response });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error in receiving user data!");
  }
});
//TODO: Create proper routes and handle the props associated with each request.
// app.get("/start", async(req, res) => {
//     try {
//       const response=await prisma.conversation.create({
//         data:{
//           role:'user',
//           interviewId:'cd5c2740-4a6d-416e-b1de-9c63344da87f',
//           text:googleHr
//         }
//       });
//       console.log(response);
//       return res.status(200).send(response);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send("Error in receiving user data!");
//     }
// });

const getChatHistory = async (interviewId: string) => {
  try {
    console.log(interviewId);
    const response = await prisma.conversation.findMany({
      where: {
        interviewId: interviewId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    const history = response.map((item) => {
      return {
        role: item.role,
        parts: [{ text: item.text }],
      };
    });

    return history;
  } catch (error) {
    return [];
  }
};

app.post("/transcribe", upload, async (req, res) => {
  //TODO: Create a TEST THE ROUTE!
  try {
    const outputAudioa = path.join(__dirname, "/uploads/recording.webm");
    const response = await transcribeFile();
    console.log(response);
    const history = await getChatHistory(
      "cd5c2740-4a6d-416e-b1de-9c63344da87f",
    );
    const textGen = await useAi(response, history);
    console.log("Text generated:", textGen);
    await getAudio(textGen);
    const outputAudio = path.join(__dirname, "output.wav");
    if (!fs.existsSync(outputAudio)) throw "Not Found!";
    prisma.conversation.create({
      data: {
        role: "user",
        text: response,
        interviewId: "cd5c2740-4a6d-416e-b1de-9c63344da87f",
      },
    });
    prisma.conversation.create({
      data: {
        role: "model",
        text: textGen,
        interviewId: "cd5c2740-4a6d-416e-b1de-9c63344da87f",
      },
    });
    return res.sendFile(outputAudio);
  } catch (error) {
    console.log(error);
    return res.sendFile(path.join(__dirname, "audio_files/error.wav"));
    //TODO: SEND A SUCCESS BOOL AS WELL TO TAKE STEPS IN FRONTEND!
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
