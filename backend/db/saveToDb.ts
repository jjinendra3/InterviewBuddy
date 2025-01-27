import prisma from "./prisma";

export const createInterview = async (round: string, candidateId: string) => {
  return await prisma.interview.create({
    data: {
      round: round,
      candidateId: candidateId,
    },
  });
};

export const saveToDbUser = (text: string, interviewId: string) => {
  prisma.conversation.create({
    data: {
      role: "user",
      text: text,
      interviewId: interviewId,
    },
  });
  return;
};

export const saveToDbModel = (text: string, interviewId: string) => {
  prisma.conversation.create({
    data: {
      role: "model",
      text: text,
      interviewId: interviewId,
    },
  });
  return;
};

export const getChatHistory = async (interviewId: string) => {
  try {
    console.log(interviewId);
    const response = await prisma.conversation.findMany({
      where: {
        interviewId: interviewId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    const history = response.map((item) => {
      return {
        role: item.role,
        parts: [{ text: item.text }],
      };
    });

    return history;
  } catch (error) {
    return [];
  }
};
