// import { createClient } from "@deepgram/sdk";
// const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// export const getAudio = async (text: string) => {
//   try {
//     const response = await deepgram.speak.request(
//       { text },
//       {
//         model: "aura-asteria-en",
//         encoding: "linear16",
//         container: "wav",
//       },
//     );

//     const stream = await response.getStream();
//     if (!stream) {
//       throw new Error("Failed to generate audio stream");
//     }

//     const buffer = await getAudioBuffer(stream);
//     return buffer;
//   } catch (error) {
//     console.error("Error in getAudio:", error);
//     throw error;
//   }
// };

// //eslint-disable-next-line
// const getAudioBuffer = async (response: any) => {
//   const reader = response.getReader();
//   const chunks = [];

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     chunks.push(value);
//   }

//   const dataArray = chunks.reduce(
//     (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
//     new Uint8Array(0),
//   );

//   return Buffer.from(dataArray.buffer);
// };
import { ElevenLabsClient } from "elevenlabs";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const createAudioBufferFromText = async (
  text: string,
): Promise<Buffer> => {
  try {
    const audioStream = await client.textToSpeech.convert(
      "JBFqnCBsd6RMkjVDRZzb",
      {
        model_id: "eleven_multilingual_v2",
        text,
        output_format: "mp3_44100_128",
        voice_settings: {
          stability: 0,
          similarity_boost: 0,
          use_speaker_boost: true,
          speed: 1.0,
        },
      },
    );

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    throw error;
  }
};
