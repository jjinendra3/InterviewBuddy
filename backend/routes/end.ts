import { Router } from "express";
import { pdfGenerator } from "../helpers/generatePDF";
import { useAi } from "../helpers/ai";
import { getChatHistory } from "../db/saveToDb";

const fs = require("fs");
const app = Router();
const path = require("path");

app.get("/:id", async (req, res) => {
  try {
    const interviewId = req.params.id;
    const history = await getChatHistory(interviewId);
    const endInterviewPrompt = fs.readFileSync(
      process.env.INTERVIEW_END_PROMPT_PATH,
      "utf-8"
    );
    // //TODO: INTRODUCE A NEW GENERATETEXT FOR THIS
    const textGen = await useAi("google-hr", endInterviewPrompt, history, null);
    await pdfGenerator(textGen.reply);
  } catch (error) {
    const outputReport = path.join(__dirname, "output.pdf");
    if (!fs.existsSync(outputReport)) return res.status(500).send(error);
  } finally {
    const outputReport = path.join(__dirname, "output.pdf");
    return res.status(200).sendFile(outputReport);
  }
});
module.exports = app;
