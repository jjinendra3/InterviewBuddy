const { createClient } = require("@deepgram/sdk");
const fs = require("fs");
const dotenv=require('dotenv');
dotenv.config();

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export const getAudio = async (text:string) => {
  const response = await deepgram.speak.request(
    { text },
    {
      model: "aura-asteria-en",
      encoding: "linear16",
      container: "wav",
    }
  );
  const stream = await response.getStream();
  const headers = await response.getHeaders();
  if (stream) {
    const buffer = await getAudioBuffer(stream);
    fs.writeFile("output.wav", buffer, (err) => {
      if (err) {
        console.error("Error writing audio to file:", err);
      } else {
        console.log("Audio file written to output.wav");
      }
    });
  } else {
    console.error("Error generating audio:", stream);
  }

  if (headers) {
    console.log("Headers:", headers);
  }
};

const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};

