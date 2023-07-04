import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";

import * as tokenRep from "../repositories/tokenRepository.js";
import * as userRep from "../repositories/userRepository.js";

const router = express.Router();

router.route("/login").post(async (req, res) => {
  try {
    const email = req.body.email;
    const { password, pk_user } = await userRep.getUserByEmail(email);
    bcrypt.compare(req.body.password, password, async (err, result) => {
      if (!result) return res.sendStatus(401);
      const accessToken = tokenRep.generateAccessToken({
        email: email,
        pk_user: pk_user,
      });
      const refreshToken = await tokenRep.generateRefreshToken({
        email: email,
        pk_user: pk_user,
      });
      tokenRep.setAccessTokenCookie(res, accessToken);
      tokenRep.setRefreshTokenCookie(res, refreshToken);
      res.sendStatus(200);
    });
  } catch {
    return res.sendStatus(500);
  }
});

router.route("/token").get(tokenRep.authRefreshToken, async (req, res) => {
  try {
    if (!req.body.accessToken) return res.sendStatus(401);
    const refreshToken = await tokenRep.generateRefreshToken({
      email: req.body.email,
      pk_user: req.body.pk_user,
    });
    tokenRep.setAccessTokenCookie(res, req.body.accessToken);
    tokenRep.setRefreshTokenCookie(res, refreshToken);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(401);
  }
});

router.route("/register").post(async (req, res) => {
  try {
    bcrypt.hash(req.body.password, 5, async (err, hash) => {
      req.body.password = hash;
      if (validator.isEmail(req.body.email) && req.body.username) {
        req.body.id_user = generateRandomId(15);
        if (!(await userRep.createUser(req.body))) {
          return res.sendStatus(500);
        }
        return res.sendStatus(201);
      } else {
        res.sendStatus(500);
      }
    });
  } catch {
    return res.sendStatus(500);
  }
});

router.use(tokenRep.authAccessToken);

router.route("/test").get((req, res) => {
  return res.json("/test").status(201);
});

function generateRandomId(length) {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
  let id = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * characters.length);
    id += characters.charAt(idx);
  }
  return id;
}

export default router;
