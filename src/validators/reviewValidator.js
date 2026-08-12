import { body, param, query } from "express-validator";

export const createReviewValidator = [
  param("productId")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a positive integer."),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5."),

  body("comment")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Comment cannot exceed 2000 characters."),
];


export const updateReviewValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Review ID must be a positive integer."),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5."),

  body("comment")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Comment cannot exceed 2000 characters."),

  body()
    .custom((body) => {
      if (
        body.rating === undefined &&
        body.comment === undefined
      ) {
        throw new Error(
          "At least rating or comment must be provided."
        );
      }

      return true;
    }),
];


export const reviewIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Review ID must be a positive integer."),
];


export const productReviewValidator = [
  param("productId")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a positive integer."),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),

  query("sortBy")
    .optional()
    .isIn(["created_at", "rating"])
    .withMessage(
      "Sort field must be created_at or rating."
    ),

  query("sortOrder")
    .optional()
    .isIn(["ASC", "DESC", "asc", "desc"])
    .withMessage(
      "Sort order must be ASC or DESC."
    ),
];