import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get(
  "/",
  getCategoriesController
);

router.get(
  "/:id",
  getCategoryByIdController
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCategoryController
);

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCategoryController
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategoryController
);

export default router;