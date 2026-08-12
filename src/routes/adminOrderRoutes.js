import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import validationMiddleware from "../middleware/validationMiddleware.js";

import {
  updateOrderStatusValidator,
} from "../validators/orderValidator.js";

import {
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/orderController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllOrdersController
);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatusValidator,
  validationMiddleware,
  updateOrderStatusController
);

export default router;