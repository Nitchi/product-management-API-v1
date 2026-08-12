import { createProduct, getProducts, updateProduct, deleteProduct, getProductById } from "../services/productService.js";
import asyncHandler from "../middleware/asyncHandler.js"
import { getPagination } from "../utils/pagination.js";


export const createProductController = async (req, res, next) => {
  try {
    const { page, limit } = getPagination(
      req.query
    );

    const { categoryId, search } = req.query;

    const result = await getProducts({
      page,
      limit,
      categoryId,
      search,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductsController = async (req, res, next) => {
  try {
   const { page, limit } =
      getPagination(req.query);

    const {
      categoryId,
      search,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    } = req.query;


    const result = await getProducts({
      page,
      limit,
      categoryId,
      search,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    });


    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    const result = await getProductById(productId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const updateProductController = async (req, res, next) => {
  try {
    const result = await updateProduct(
      req.params.id,
      req.body,
      req.file
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteProductController = async (req, res, next) => {
  try {
    const result = await deleteProduct(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};