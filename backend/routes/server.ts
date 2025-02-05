import { Router } from "express";
const app = Router();
app.head("/", (req, res) => {
  return res.status(200).send("OK");
});
module.exports = app;
