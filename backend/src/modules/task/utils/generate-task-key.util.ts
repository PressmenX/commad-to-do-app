import { PrismaService } from '../../prisma/prisma.service';
import { customAlphabet } from 'nanoid';

const ALPHABET = '1234567890abcdefghijklmnopqrstuvwxyz';
const LENGTH = 4;

const generateID = customAlphabet(ALPHABET, LENGTH);

export const generateTaskKey = async (
  prisma: PrismaService,
  userId: string,
): Promise<string> => {
  let key: string;
  let isExist: boolean;

  do {
    key = generateID();
    const existingTask = await prisma.task.findFirst({
      where: { taskKey: key, userId },
    });
    isExist = existingTask !== null;
  } while (isExist);

  return key;
};
