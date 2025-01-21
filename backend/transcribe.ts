const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();
const { createClient } = require("@deepgram/sdk");

export const transcribeFile = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    fs.readFileSync("uploads/recording.webm"),
    {
      model: "nova-2",
      smart_format: true,
    },
  );

  if (error) throw error;
  if (!error) return result.results.channels[0].alternatives[0].transcript;
};
