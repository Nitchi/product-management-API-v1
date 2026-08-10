import express from "express";
import { register, login } from "../controllers/authController.js";
import { registerValidator, loginValidator, registerAdmin} from "../validators/authValidator.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authorize from "../middleware/authMiddleware.js";
import ROLES from "../constants/roles.js";


const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validationMiddleware,
  register
);

router.post(
  "/login",
  loginValidator,
  validationMiddleware,
  login
);

router.post(
  "/admin",
  authMiddleware,
  authorize(ROLES.ADMIN),
  registerValidator,
  validationMiddleware,
  registerAdmin
);

export default router;