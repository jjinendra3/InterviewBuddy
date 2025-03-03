import { createClient } from "@deepgram/sdk";
import * as fs from "fs";

const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

export const getAudio = async (text: string) => {
  const response = await deepgram.speak.request(
    { text },
    {
      model: "aura-asteria-en",
      encoding: "linear16",
      container: "wav",
    },
  );
  const stream = await response.getStream();
  const headers = await response.getHeaders();
  if (stream) {
    const buffer = await getAudioBuffer(stream);
    try {
      fs.writeFileSync("output.wav", buffer);
      console.log("Audio file written to output.wav");
    } catch (err) {
      console.error("Error writing audio to file:", err);
    }
  } else {
    console.error("Error generating audio:", stream);
  }

  if (headers) {
    console.log("Headers:", headers);
  }
};
//eslint-disable-next-line
const getAudioBuffer = async (response: any) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0),
  );

  return Buffer.from(dataArray.buffer);
};
