import express from "express";

import * as userRep from "../repositories/userRepository.js";

const router = express.Router();

router
  .route("/:id")
  .get(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.sendStatus(422);
    const user = await userRep.getUserById(id);
    if (!user) return res.sendStatus(500);
    const { password, email, ...newUser } = user;
    return res.send(newUser);
  })
  .delete(async (req, res) => {
    if (isNaN(parseInt(req.params.id))) return res.sendStatus(422);
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.sendStatus(422);
    const patched = await reviewRep.deleteReviewById(id, req.body.id);
    if (!patched) return res.sendStatus(500);
    return res.send(patched);
  });


export default router;
