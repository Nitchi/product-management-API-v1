import { Category, Product } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

export const getCategories = async () => {
  const categories = await Category.findAll({
    order: [["name", "ASC"]],
  });

  return {
    success: true,
    data: categories,
  };
};

export const getCategoryById = async (categoryId) => {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Category not found."
    );
  }

  return {
    success: true,
    data: category,
  };
};

export const createCategory = async (name, description) => {
  const existingCategory = await Category.findOne({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "A category with this name already exists."
    );
  }

  const category = await Category.create({
    name,
    description,
  });

  return {
    success: true,
    message: "Category created successfully.",
    data: category,
  };
};

export const updateCategory = async (
  categoryId,
  name,
  description
) => {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Category not found."
    );
  }

  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({
      where: {
        name,
      },
    });

    if (existingCategory) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "A category with this name already exists."
      );
    }
  }

  await category.update({
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
  });

  return {
    success: true,
    message: "Category updated successfully.",
    data: category,
  };
};

export const deleteCategory = async (categoryId) => {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Category not found."
    );
  }

  const productCount = await Product.count({
    where: {
      category_id: categoryId,
    },
  });

  if (productCount > 0) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "Category cannot be deleted because it has products assigned to it."
    );
  }

  await category.destroy();

  return {
    success: true,
    message: "Category deleted successfully.",
  };
};