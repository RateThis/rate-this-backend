import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";

import * as tokenRep from "../repositories/tokenRepository.js";
import * as userRep from "../repositories/userRepository.js";
import { generateRandomId } from "../utils/generator.js";

const router = express.Router();

router.route("/login").post(async (req, res) => {
  try {
    const email = req.body.email;
    const { password, id } = await userRep.getUserByEmail(email);
    bcrypt.compare(req.body.password, password, async (err, result) => {
      if (!result) return res.sendStatus(401);
      const accessToken = tokenRep.generateAccessToken({
        email: email,
        id: id,
      });
      const refreshToken = await tokenRep.generateRefreshToken({
        email: email,
        id: id,
      });
      tokenRep.setAccessTokenCookie(res, accessToken);
      tokenRep.setRefreshTokenCookie(res, refreshToken);
      res.status(200).send(true);
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
      id: req.body.id,
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
      if (validator.isEmail(req.body.email) && req.body.name) {
        req.body.uuid = generateRandomId(15);
        if (!(await userRep.createUser(req.body))) {
          return res.sendStatus(500);
        }
        return res.status(201).send(true);
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

export default router;
