import { Router } from "express";
const app = Router();
app.get("/", (req, res) => {
  return res.status(200).send("OK");
});
module.exports = app;
