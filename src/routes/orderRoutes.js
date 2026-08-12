import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import validationMiddleware from "../middleware/validationMiddleware.js";

import {
  createOrderValidator,
  
} from "../validators/orderValidator.js";

import {
  createOrderController,
  getUserOrdersController,
  getOrderByIdController,
  cancelOrderController
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createOrderValidator,
  validationMiddleware,
  createOrderController
);

router.get(
  "/",
  authMiddleware,
  getUserOrdersController
);

router.get(
  "/:id",
  authMiddleware,
  getOrderByIdController
);


export const getAllOrders = async () => {
  const orders = await Order.findAll({
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: [
              "id",
              "name",
              "image_url",
            ],
          },
        ],
      },
    ],

    order: [["created_at", "DESC"]],
  });

  return {
    success: true,
    data: orders,
  };
};


router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelOrderController
);


export default router;