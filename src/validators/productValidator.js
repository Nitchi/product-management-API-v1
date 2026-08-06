import { body } from "express-validator";

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