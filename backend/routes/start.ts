import { Router } from "express";
const app = Router();
import { createInterview } from "../db/saveToDb";
app.post("/", async (req, res) => {
  try {
    const { userId, round } = req.body;
    const response = await createInterview(round, userId);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = app;
