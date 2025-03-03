import prisma from "@/db/prisma";

export async function POST(req: Request) {
  try {
    const { uid, name, email } = await req.json();
    if (!uid || !name || !email) {
      return new Response("Not found", { status: 200 });
    }
    const userId = uid as string;
    const userName = name as string;
    const userEmail = email as string;
    const userExists = await prisma.user.findFirst({
      where: { email: userEmail },
    });
    if (userExists) {
      return new Response(
        JSON.stringify({
          message: "User already exists",
          user: {
            uid: userExists.uid,
            email: userExists.email,
            name: userExists.name,
          },
        }),
        { status: 200 }
      );
    }
    const newUser = await prisma.user.create({
      data: {
        name: userName,
        email: userEmail,
        uid: userId,
      },
    });
    const response = {
      success: true,
      user: newUser,
    };
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ success: false, user: null }), {
      status: 500,
    });
  }
}
