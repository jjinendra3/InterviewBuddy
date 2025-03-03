import { generateObject } from "ai";
import { z } from "zod";
import { GEMINI_1_5_FLASH } from "@/lib/utils/ai";
import { getPrompts } from "@/db/dbFunctions";

const schema = z.object({
  rating: z.number().int().min(0).max(100),
  detailedReview: z.string(),
});

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const country = formData.get("country") as string;
  if (!file || !country) {
    return new Response(JSON.stringify({ error: "Missing file or country" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const systemInstruction = await getPrompts("resume-review");
  if (!systemInstruction) {
    return new Response(
      JSON.stringify({ error: "System instruction not found" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const result = await generateObject({
    model: GEMINI_1_5_FLASH,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: `Country: ${country}` },
          {
            type: "file",
            data: await file.arrayBuffer(),
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    system: systemInstruction,
    schema,
  });
  console.log(result.object);

  return new Response(JSON.stringify(result.object), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
