// index.js (node example)
const dotenv = require('dotenv');
dotenv.config();
const { createClient } = require("@deepgram/sdk");
const fs = require("fs");

const transcribeFile = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    fs.readFileSync("lol.mp3"),
    {
      model: "nova-2",
      smart_format: true,
    }
  );

  if (error) throw error;
  if (!error) console.dir(result, { depth: null });
};

transcribeFile();