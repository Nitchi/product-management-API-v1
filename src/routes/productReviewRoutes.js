import express from "express";

import {
  createReviewController,
  getProductReviewsController,
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createReviewValidator,
  productReviewValidator,
} from "../validators/reviewValidator.js";

import validationMiddleware from "../middleware/validationMiddleware.js";

const router = express.Router();

/*
 * GET /api/v1/products/:productId/reviews
 */
router.get(
  "/:productId/reviews",
  productReviewValidator,
  validationMiddleware,
  getProductReviewsController
);

/*
 * POST /api/v1/products/:productId/reviews
 */
router.post(
  "/:productId/reviews",
  authMiddleware,
  createReviewValidator,
  validationMiddleware,
  createReviewController
);

export default router;