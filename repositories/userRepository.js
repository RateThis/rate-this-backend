import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createUser(reqBody) {
  try {
    return await prisma.users.create({
      data: {
        id_user: reqBody.id_user,
        username: reqBody.username,
        email: reqBody.email,
        password: reqBody.password,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function deleteUserById(userId) {
  try {
    if (pk_user) {
      return await prisma.users.delete({
        where: {
          pk_user: userId,
        },
      });
    }
    return;
  } catch (error) {
    return null;
  }
}

export async function getUserByEmail(email) {
  try {
    if (email) {
      return await prisma.users.findUnique({
        where: { email: email },
      });
    }
    return;
  } catch (error) {
    return null;
  }
}
