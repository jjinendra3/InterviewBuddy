import prisma from "@/db/prisma";
import { GEMINI_1_5_FLASH } from "@/lib/utils/ai";
import { generateObject } from "ai";
import { z } from "zod";

const InterviewEvaluationSchema = z.object({
  scores: z.object({
    communicationSkills: z.number().min(0).max(10),
    technicalKnowledge: z.number().min(0).max(10),
    problemSolvingAbility: z.number().min(0).max(10),
    behavioralCompetence: z.number().min(0).max(10),
    overallImpression: z.number().min(0).max(10),
  }),

  feedback: z.object({
    communicationFeedback: z.string().min(50),
    technicalFeedback: z.string().min(50),
    problemSolvingFeedback: z.string().min(50),
    behavioralFeedback: z.string().min(50),
    overallFeedback: z.string().min(100),
  }),

  highlights: z.object({
    topStrengths: z.array(z.string()).min(2).max(5),
    improvementAreas: z.array(z.string()).min(2).max(5),
  }),

  recommendations: z.array(z.string()).min(3).max(7),

  keyMoments: z
    .array(
      z.object({
        question: z.string(),
        responseEvaluation: z.string().min(50),
        improvementSuggestion: z.string().min(30),
      })
    )
    .min(2)
    .max(5),
});

export async function POST(req: Request) {
  try {
    const prompt = await prisma.prompts.findFirst({
      where: {
        name: "end-interview",
      },
    });
    if (!prompt) {
      return new Response(
        JSON.stringify({
          success: false,
          data: null,
        }),
        { status: 500 }
      );
    }
    const { conversation } = await req.json();
    const response = await generateObject({
      model: GEMINI_1_5_FLASH,
      messages: conversation,
      system: prompt.prompt,
      schema: InterviewEvaluationSchema,
    });
    if (!response) {
      throw new Error("Failed to generate response");
    }
    return new Response(
      JSON.stringify({
        success: true,
        data: response,
      }),
      { status: 200 }
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        data: null,
      }),
      { status: 500 }
    );
  }
}
