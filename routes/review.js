import express from "express";

import { generateRandomId } from "../utils/generator.js";
// import { getDateOffsetUTC } from "../utils/date.js";
import * as tokenRep from "../repositories/tokenRepository.js";
import * as reviewRep from "../repositories/reviewRepository.js";

const router = express.Router();

router.use(tokenRep.authAccessToken);

router
  .route("/:id")
  .patch(async (req, res) => {
    if (
      !(!isNaN(parseInt(req.body.rating)) || req.body.text) ||
      isNaN(req.body.id)
    )
      return res.sendStatus(422);
    const id = parseInt(req.params.id);
    const text = req.body.text;
    const rating = req.body.rating;
    const create_time = req.body.create_time ? new Date(Date.now()) : undefined;
    if (isNaN(id)) return res.sendStatus(422);
    const data = Object.assign(
      { last_edit_time: new Date(Date.now()) },
      rating && { rating },
      text && { text },
      create_time && { create_time }
    );
    const patched = await reviewRep.patchReviewById(id, data, req.body.id);
    if (!patched) return res.sendStatus(500);
    return res.send(patched);
  })
  .delete(async (req, res) => {
    if (isNaN(parseInt(req.params.id))) return res.sendStatus(422);
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.sendStatus(422);
    const patched = await reviewRep.deleteReviewById(id, req.body.id);
    if (!patched) return res.sendStatus(500);
    return res.send(patched);
  });

router.route("/").post(async (req, res) => {
  if (!req.body.id) return res.sendStatus(401);
  if (
    !reviewRep.entitiesTypes.includes(req.params.entity_type) ||
    isNaN(parseInt(req.params.id_entity)) ||
    isNaN(parseInt(req.body.rating)) ||
    parseInt(req.body.rating) < 0
  )
    return res.sendStatus(422);
  const data = {
    entity_type: req.params.entity_type,
    id_entity: req.params.id_entity,
    id_user: req.body.id,
    uuid: generateRandomId(15),
    rating: req.body.rating,
    text: req.body.text || null,
  };
  const review = await reviewRep.createReview(data);
  if (!review) return res.sendStatus(500);
  return res.send(review).status(200);
});

router
  .route("/:entity_type/:id_entity")
  .get(async (req, res) => {
    if (!req.body.id) return res.sendStatus(401);
    if (
      !reviewRep.entitiesTypes.includes(req.params.entity_type) ||
      isNaN(parseInt(req.params.id_entity))
    )
      return res.sendStatus(422);
    const review = await reviewRep.getReview(
      {
        entity_type: req.params.entity_type,
        id_entity: req.params.id_entity,
      },
      parseInt(req.body.id)
    );
    if (!review) return res.send(null);
    // if (!review) return res.sendStatus(404);
    return res.send(review).status(200);
  })
  .post(async (req, res) => {
    if (!req.body.id) return res.sendStatus(401);
    if (
      !reviewRep.entitiesTypes.includes(req.params.entity_type) ||
      !req.params.id_entity ||
      isNaN(parseInt(req.body.rating))
    )
      return res.sendStatus(422);
    const data = {
      entity_type: req.params.entity_type,
      id_entity: req.params.id_entity,
      id_user: req.body.id,
      uuid: generateRandomId(15),
      rating: parseInt(req.body.rating),
      text: req.body.text || null,
    };
    const review = await reviewRep.createReview(data);
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

router.route("/:entity_type/:id_entity/count").get(async (req, res) => {
  if (
    !reviewRep.entitiesTypes.includes(req.params.entity_type) ||
    isNaN(parseInt(req.params.id_entity))
  )
    return res.sendStatus(422);
  const count = await reviewRep.getAllReviewsCount({
    entity_type: req.params.entity_type,
    id_entity: req.params.id_entity,
  });
  if (isNaN(count)) return res.sendStatus(500);
  return res.send(JSON.parse(`{ "count": ${count} }`));
});

export default router;
