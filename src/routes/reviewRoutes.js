import express from "express";

import {
  getReviewByIdController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  updateReviewValidator,
  reviewIdValidator,
} from "../validators/reviewValidator.js";

import validationMiddleware from "../middleware/validationMiddleware.js";

const router = express.Router();

/*
 * GET /api/v1/reviews/:id
 */
router.get(
  "/:id",
  reviewIdValidator,
  validationMiddleware,
  getReviewByIdController
);

/*
 * PATCH /api/v1/reviews/:id
 */
router.patch(
  "/:id",
  authMiddleware,
  updateReviewValidator,
  validationMiddleware,
  updateReviewController
);

/*
 * DELETE /api/v1/reviews/:id
 */
router.delete(
  "/:id",
  authMiddleware,
  reviewIdValidator,
  validationMiddleware,
  deleteReviewController
);

export default router;