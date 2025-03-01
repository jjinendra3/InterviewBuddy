import { CoreMessage } from "ai";
import prisma from "./prisma";

export const createInterview = async (round: string, candidateId: string) => {
  return await prisma.interview.create({
    data: {
      round: round,
      candidateId: candidateId,
    },
  });
};

export const saveToDbUser = async (text: string, interviewId: string) => {
  return await prisma.conversation.create({
    data: {
      role: "user",
      text: text,
      interviewId: interviewId,
    },
  });
};

export const saveToDbModel = async (text: string, interviewId: string) => {
  return await prisma.conversation.create({
    data: {
      role: "model",
      text: text,
      interviewId: interviewId,
    },
  });
};

export const getChatHistory = async (
  interviewId: string,
): Promise<CoreMessage[]> => {
  try {
    const response = await prisma.conversation.findMany({
      where: {
        interviewId: interviewId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    const history: CoreMessage[] = response.map((item) => {
      return {
        role: item.role,
        text: item.text,
      };
    }) as CoreMessage[];

    return history;
  } catch (error) {
    return [];
  }
};
