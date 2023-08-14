import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const entitiesTypes = ["movie", "game", "series", "music", "book"];

export async function getReview(criteria, userId) {
  if (criteria.id_entity && criteria.entity_type && userId) {
    try {
      return await prisma.reviews.findUnique({
        where: {
          id_user_id_entity_entity_type: {
            id_user: userId,
            entity_type: criteria.entity_type,
            id_entity: criteria.id_entity
          }
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  return null;
}

export async function getAllReviews(criteria) {
  if (criteria.id_entity && criteria.entity_type) {
    try {
      return await prisma.reviews.findMany({
        where: {
          AND: [
            {
              id_entity: criteria.id_entity,
            },
            {
              entity_type: criteria.entity_type,
            },
          ],
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  return null;
}

export async function getAllReviewsCount(criteria) {
  if (criteria.id_entity && criteria.entity_type) {
    try {
      // return await prisma.$queryRaw`select COUNT(*) as 'count' from reviews where entity_type = "movie" and id_entity = 222`;
      return await prisma.reviews.count({
        where: {
          AND: [
            { entity_type: criteria.entity_type },
            { id_entity: criteria.id_entity },
          ],
        },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  return null;
}

export async function patchReviewById(id, data, userId) {
  try {
    return await prisma.reviews.update({
      where: {
        id,
        id_user: userId,
      },
      data,
    });
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteReviewById(id, userId) {
  try {
    return await prisma.reviews.delete({
      where: {
        id,
        id_user: userId,
      },
    });
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function createReview(data) {
  if (
    data.id_user &&
    data.id_entity &&
    data.entity_type &&
    data.uuid &&
    !isNaN(data.rating)
  ) {
    try {
      return await prisma.reviews.create({
        data: data,
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
