import express from "express";

import {
  adminDeleteReviewController,
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  reviewIdValidator,
} from "../validators/reviewValidator.js";

import validationMiddleware from "../middleware/validationMiddleware.js";

const router = express.Router();

/*
 * DELETE /api/v1/admin/reviews/:id
 */
router.delete(
  "/reviews/:id",
  authMiddleware,
  adminMiddleware,
  reviewIdValidator,
  validationMiddleware,
  adminDeleteReviewController
);

export default router;