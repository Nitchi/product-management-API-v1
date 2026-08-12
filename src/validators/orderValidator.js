import { body } from "express-validator";

export const createOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item."),

  body("items.*.product_id")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a valid integer."),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1."),
];


export const updateOrderStatusValidator = [
  body("status")
    .isIn([
      "PENDING",
      "PROCESSING",
      "DELIVERED",
      "CANCELLED",
    ])
    .withMessage("Invalid order status."),
];

