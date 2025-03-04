import { generateObject } from "ai";
import { z } from "zod";
import { GEMINI_1_5_FLASH } from "@/lib/utils/ai";
import { getPrompts } from "@/db/dbFunctions";

const schema = z.object({
  rating: z.number().int().min(0).max(100),
  detailedReview: z.string(),
});

export async function POST(req: Request) {
  try {
    const { file, country } = await req.json();

    if (!file || !country) {
      return Response.json(
        { error: "Missing file or country" },
        { status: 400 },
      );
    }

    let fileBuffer;
    try {
      const base64Data = file.includes(",") ? file.split(",")[1] : file;
      fileBuffer = Buffer.from(base64Data, "base64");
    } catch {
      return Response.json({ error: "Invalid file encoding" }, { status: 400 });
    }

    const systemInstruction = await getPrompts("resume-review");
    if (!systemInstruction) {
      return Response.json(
        { error: "System instruction not found" },
        { status: 500 },
      );
    }

    const result = await generateObject({
      model: GEMINI_1_5_FLASH,
      messages: [
        {
          role: "user",
          content: file
            ? [
                {
                  type: "text",
                  text: `Country: ${country}`,
                },
                {
                  type: "file",
                  mimeType: "application/pdf",
                  data: fileBuffer,
                },
              ]
            : [
                {
                  type: "text",
                  text: `Country: ${country}`,
                },
              ],
        },
      ],
      system: systemInstruction,
      schema,
    });

    return Response.json(result.object);
  } catch {
    return Response.json(
      { error: "Failed to process resume" },
      { status: 500 },
    );
  }
}
