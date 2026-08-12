import express from "express";
import { createProductController, getProductsController, getProductByIdController,
  updateProductController, deleteProductController
} from "../controllers/productController.js";
import { createReviewController, getProductReviewsController } from "../controllers/reviewController.js"
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorizeMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import validationMiddleware from "../middleware/validationMiddleware.js";
import { createProductValidator,getProductsValidator } from "../validators/productValidator.js";
import { createReviewValidator, productReviewValidator } from "../validators/reviewValidator.js";
import ROLES from "../constants/roles.js";
const router = express.Router();


// Create product - ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  authorize(ROLES.ADMIN),
  upload.single("image"),
  createProductValidator,
  validationMiddleware,
  createProductController
);


// Get products - PUBLIC
router.get(
  "/",
  getProductsValidator,
  validationMiddleware,
  getProductsController
);

router.get(
  "/:id",
  getProductByIdController
);

router.patch(
  "/:id",
  authMiddleware,
  authorize(ROLES.ADMIN),
  upload.single("image"),
  updateProductController
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(ROLES.ADMIN),
  deleteProductController
);

router.get(
  "/:productId/reviews",
  productReviewValidator,
  validationMiddleware,
  getProductReviewsController
);

router.post(
  "/:productId/reviews",
  authMiddleware,
  createReviewValidator,
  validationMiddleware,
  createReviewController
);
export default router;