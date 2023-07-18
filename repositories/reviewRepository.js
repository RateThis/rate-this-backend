import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const entitiesTypes = ["movie", "game", "series", "music", "book"];

export async function getReview(criteria) {
  if (criteria.id_user && criteria.id_entity && criteria.entity_type) {
    try {
      return await prisma.reviews.findUnique({
        where: {
          id_user_id_entity_entity_type: criteria,
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  return null;
}

export async function deleteReview(criteria) {
  if (criteria.id_user && criteria.id_entity && criteria.entity_type) {
    try {
      return await prisma.reviews.delete({
        where: {
          id_user_id_entity_entity_type: criteria,
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  return null;
}

export async function createReview(reqBody) {
  if (
    reqBody.id &&
    reqBody.id_entity &&
    reqBody.entity_type &&
    reqBody.uuid &&
    reqBody.rating
  ) {
    try {
      return await prisma.reviews.create({
        data: {
          id_user: reqBody.id,
          id_entity: reqBody.id_entity,
          entity_type: reqBody.entity_type,
          uuid: reqBody.uuid,
          rating: reqBody.rating,
          text: reqBody.text || null,
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  return null;
}
