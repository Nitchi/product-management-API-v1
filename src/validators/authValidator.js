import { body } from "express-validator";

export const registerValidator = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email.")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character."),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Enter a valid email.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];