import express from "express";
import bcrypt from "bcrypt";
import validator from "validator";
import * as userRep from "../repositories/userRepository.js";

const router = express.Router();

router.route("/login").post(async (req, res) => {
  try {
    const { password } = await userRep.getUserByEmail(req.body.email);
    bcrypt.compare(req.body.password, password, (_err, result) => {
      return result ? res.sendStatus(200) : res.sendStatus(500);
    });
  } catch {
    return res.sendStatus(500);
  }
});

router.route("/register").post(async (req, res) => {
  try {
    bcrypt.hash(req.body.password, 5, async (_err, hash) => {
      req.body.password = hash;
      if (validator.isEmail(req.body.email) && req.body.username) {
        req.body.id_user = generateRandomId(15);
        return (await userRep.createUser(req.body))
          ? res.sendStatus(200)
          : res.sendStatus(500);
      }
    });
  } catch {
    return res.sendStatus(500);
  }
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
