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
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const country = formData.get("country") as string;
    if (!file || !country) {
      return Response.json(
        { error: "Missing file or country" },
        { status: 400 },
      );
    }
    const fileBase64 = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileBase64);
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
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to process resume" },
      { status: 500 },
    );
  }
}
