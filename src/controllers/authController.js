import { registerUser, loginUser, createAdmin } from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const registerAdmin = async (req, res,next) => {
  try {

    const result = await createAdmin(req.body);

    return res.status(201).json(result);

  } catch (error) {
    next(error);
  }
};