import { body } from "express-validator";
import { query } from "express-validator";

export const createProductValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required.")
        .isLength({ max: 150 })
        .withMessage("Product name cannot exceed 150 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required."),

    body("category_id")
        .isUUID()
        .withMessage("Invalid category."),

    body("price")
        .isDecimal({ decimal_digits: "0,2" })
        .withMessage("Price must be a valid decimal.")
        .custom(value => value > 0)
        .withMessage("Price must be greater than zero."),

    body("quantity_in_stock")
        .isInt({ min: 0 })
        .withMessage("Quantity cannot be negative."),

    body("discount_percentage")
        .optional()
        .isFloat({
            min: 0,
            max: 100,
        })
        .withMessage(
            "Discount must be between 0 and 100."
        ),
];



export const getProductsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),

  query("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer."),

  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Search must be between 1 and 100 characters."
    ),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a valid positive number."),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a valid positive number."),

  query("sortBy")
    .optional()
    .isIn([
      "created_at",
      "name",
      "price",
      "discount_percentage",
    ])
    .withMessage("Invalid sort field."),

  query("sortOrder")
    .optional()
    .isIn(["ASC", "DESC", "asc", "desc"])
    .withMessage(
      "Sort order must be ASC or DESC."
    ),
];