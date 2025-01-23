const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  GoogleAIFileManager,
  FileState,
} = require("@google/generative-ai/server");
const dotenv = require("dotenv");
dotenv.config();

const geminiTakesAudio = async () => {
  //Direct sending of audio file to Gemini API, will not use now due to use of audio text and lack os support of webm from gemini
  const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
  const uploadResult = await fileManager.uploadFile(`./output.wav`, {
    mimeType: "audio/wav",
    displayName: "Audio sample",
  });

  let file = await fileManager.getFile(uploadResult.file.name);
  while (file.state === FileState.PROCESSING) {
    process.stdout.write(".");
    // Sleep for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    // Fetch the file from the API again
    file = await fileManager.getFile(uploadResult.file.name);
  }

  if (file.state === FileState.FAILED) {
    throw new Error("Audio processing failed.");
  }

  // View the response.
  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
  );

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    "Tell me about this audio clip.",
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);
  return result.response.text();
};
geminiTakesAudio();
