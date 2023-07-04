import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
dotenv.config();

async function getRefreshToken(userId) {
  if (userId) {
    return await prisma.refreshtokens.findUnique({
      where: { pk_user: userId },
    });
  }
  return null;
}

async function updateRefreshToken(userId, refreshToken) {
  if (userId && refreshToken) {
    try {
      return await prisma.refreshtokens.upsert({
        where: {
          pk_user: userId,
        },
        update: {
          refresh_token: refreshToken,
        },
        create: {
          pk_user: userId,
          refresh_token: refreshToken,
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  return null;
}

export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE * 1000,
  });
}

export async function generateRefreshToken(payload) {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE * 1000,
  });
  await updateRefreshToken(payload.pk_user, refreshToken);
  return refreshToken;
}

export function setAccessTokenCookie(res, accessToken) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now() + process.env.ACCESS_TOKEN_LIFE * 1000),
  });
}

export function setRefreshTokenCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now() + process.env.REFRESH_TOKEN_LIFE * 1000),
  });
}

export function authAccessToken(req, res, next) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.redirect("/auth/token");
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.clearCookie("accessToken");
      return res.redirect("/auth/token");
    }
    req.body.email = user.email;
    req.body.pk_user = user.pk_user;
    next();
  });
}

export async function authRefreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userRemote = await getRefreshToken(user.pk_user);
    if (userRemote.refresh_token !== refreshToken) return res.sendStatus(403);
    req.body.accessToken = generateAccessToken({
      email: user.email,
      pk_user: user.pk_user,
    });
    req.body.email = user.email;
    req.body.pk_user = user.pk_user;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}
