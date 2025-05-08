import prisma from "@/db/prisma";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const response = await prisma.prompts.findFirst({
      where: {
        name: prompt,
      },
    });
    if (!response) {
      return new Response(
        JSON.stringify({
          success: false,
          data: null,
        }),
        { status: 500 }
      );
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
