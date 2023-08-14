import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createUser(reqBody) {
  try {
    return await prisma.users.create({
      data: {
        uuid: reqBody.uuid,
        name: reqBody.name,
        email: reqBody.email,
        password: reqBody.password,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function deleteUserById(id) {
  try {
    if (id) {
      return await prisma.users.delete({
        where: {
          id: id,
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
        where: { email },
      });
    }
    return;
  } catch (error) {
    return null;
  }
}

export async function getUserById(id) {
  if (isNaN(id)) return null;
  try {
    return await prisma.users.findUnique({
      where: { id },
    });
  } catch (error) {
    return null;
  }
}
