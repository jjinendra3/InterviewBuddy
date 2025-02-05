import { Router } from "express";
import { randomUUID } from "crypto";
const app = Router();
import { createInterview } from "../db/saveToDb";
app.post("/", async (req, res) => {
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
module.exports = app;
