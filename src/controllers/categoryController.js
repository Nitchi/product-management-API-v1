import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService.js";

export const getCategoriesController = async (req, res, next) => {
  try {
    const result = await getCategories();

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryByIdController = async (req, res, next) => {
  try {
    const result = await getCategoryById(
      req.params.id
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createCategoryController = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const result = await createCategory(
      name,
      description
    );

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const result = await updateCategory(
      req.params.id,
      name,
      description
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (req, res, next) => {
  try {
    const result = await deleteCategory(
      req.params.id
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};