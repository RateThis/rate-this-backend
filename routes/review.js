import express from "express";

import { generateRandomId } from "../utils/generator.js";
import * as userRep from "../repositories/userRepository.js";
import * as reviewRep from "../repositories/reviewRepository.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
  if (
    req.body.id &&
    req.body.id_entity &&
    req.body.entity_type &&
    req.body.rating
  ) {
    const rating = parseInt(req.body.rating);
    if (isNaN(rating)) return res.sendStatus(422);
    const uuid = generateRandomId(15);
    req.body.uuid = uuid;
    req.body.rating = rating;
    const review = await reviewRep.createReview(req.body);
    if (!review) return res.sendStatus(500);
    return res.sendStatus(200);
  } else {
    return res.sendStatus(422);
  }
});

router
  .route("/:entity_type/:id_entity")
  .get(async (req, res) => {
    if (!req.body.id) return res.sendStatus(401);
    if (!reviewRep.entitiesTypes.includes(req.params.entity_type))
      return res.sendStatus(422);
    req.params.id_entity;
    const review = await reviewRep.getReview({
      entity_type: req.params.entity_type,
      id_entity: req.params.id_entity,
      id_user: req.body.id,
    });
    if (!review) return res.sendStatus(500);
    return res.send(review).status(200);
  })
  .delete(async (req, res) => {
    if (!req.body.id) return res.sendStatus(401);
    if (!reviewRep.entitiesTypes.includes(req.params.entity_type))
      return res.sendStatus(422);
    req.params.id_entity;
    const review = await reviewRep.deleteReview({
      entity_type: req.params.entity_type,
      id_entity: req.params.id_entity,
      id_user: req.body.id,
    });
    if (!review) return res.sendStatus(500);
    return res.send(review).status(200);
  });

export default router;
