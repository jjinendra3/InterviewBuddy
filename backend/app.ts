import { transcribeFile } from "./transcribe";

const express = require("express");
const multer = require("multer");
const path = require("path");
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

const storage = multer.diskStorage ({
  destination : './uploads',
  filename: function (req, file, cb) {
    cb (null, file.originalname)
  }
})

const upload = multer({ storage }).fields([{ name: "file" }, { name: "audio" }]);

app.post("/transcribe", upload, async(req, res) => {
  try {    
    const response=await transcribeFile();
    return res.json(response);
  } catch (error) {
    console.error("Error handling /transcribe:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
