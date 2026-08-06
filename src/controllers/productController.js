import { createProduct } from "../services/productService.js";
import asyncHandler from "../middlewares/asyncHandler.js"


export const createProductController = asyncHandler(
  async (req, res) => {
    
    const product = await createProject(req.body, req.user);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: project,
    });
});