import { Product, Category } from "../models/index.js";
import Role from "../models/Role.js";
import { Op } from "sequelize";
import { randomUUID } from "crypto";
import slugify from "slugify";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

export const createProduct = async (productData, imageFile) => {

  let uploadedImage = null;

  try {

    const {
      name,
      description,
      category_id,
      price,
      quantity_in_stock,
      discount_percentage = 0,
    } = productData;

    const category = await Category.findByPk(category_id);

    if (!category) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Category not found."
      );
    }

    const existingProduct = await Product.findOne({
      where: {
        name,
        category_id,
      },
    });

    if (existingProduct) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "A product with this name already exists in this category."
      );
    }

    uploadedImage = await uploadToCloudinary(imageFile);

    const slug = `${slugify(name, {
      lower: true,
      strict: true,
    })}-${randomUUID().slice(0, 8)}`;

    const product = await Product.create({
      name,
      slug,
      description,
      category_id,
      price,
      quantity_in_stock,
      discount_percentage,
      image_url: uploadedImage.image_url,
      image_public_id: uploadedImage.public_id,
    });

    const createdProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    return {
      success: true,
      message: "Product created successfully.",
      data: {
        ...createdProduct.toJSON(),
        discounted_price:
          Number(createdProduct.price) *
          (1 - Number(createdProduct.discount_percentage) / 100),
      },
    };

  } catch (error) {

    if (uploadedImage?.public_id) {
      await deleteFromCloudinary(uploadedImage.public_id);
    }

    throw error;
  }
};


export const getProducts = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    category_id,
    minPrice,
    maxPrice,
    availability,
    sortBy = "createdAt",
    order = "DESC",
  } = query;

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
  const offset = (pageNumber - 1) * limitNumber;

  if (
  minPrice !== undefined &&
  maxPrice !== undefined &&
  Number(minPrice) > Number(maxPrice)
) {
  throw new ApiError(
    HTTP_STATUS.BAD_REQUEST,
    "Minimum price cannot be greater than maximum price."
  );
}

  

  const where = {};

  // Search by product name
  if (search) {
    where.name = {
      [Op.iLike]: `%${search.trim()}%`,
    };
  }

  // Filter by category
  if (category_id) {
    where.category_id = category_id;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price[Op.gte] = Number(minPrice);
    }

    if (maxPrice) {
      where.price[Op.lte] = Number(maxPrice);
    }
  }

  // Filter by availability
  if (availability === "IN_STOCK") {
    where.quantity_in_stock = {
      [Op.gt]: 0,
    };
  }

  if (availability === "OUT_OF_STOCK") {
    where.quantity_in_stock = {
      [Op.eq]: 0,
    };
  }

  // Only allow safe sorting fields
  const allowedSortFields = [
    "name",
    "price",
    "createdAt",
    "quantity_in_stock",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const safeOrder =
    order.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const { count, rows } = await Product.findAndCountAll({
    where,

    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],

    order: [[safeSortBy, safeOrder]],

    limit: limitNumber,
    offset,

    distinct: true,
  });

  const products = rows.map((product) => {
    const productData = product.toJSON();

    const price = Number(productData.price);
    const discount = Number(
      productData.discount_percentage
    );

    return {
      ...productData,

      discounted_price:
        price - (price * discount) / 100,

      availability:
        Number(productData.quantity_in_stock) > 0
          ? "IN_STOCK"
          : "OUT_OF_STOCK",
    };
  });

  return {
    success: true,

    data: products,

    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(count / limitNumber),
      totalItems: count,
      itemsPerPage: limitNumber,
    },
  };
};


export const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!product) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Product not found."
    );
  }

  const productData = product.toJSON();

  const price = Number(productData.price);
  const discount = Number(productData.discount_percentage);

  return {
    success: true,
    data: {
      ...productData,
      discounted_price: price - (price * discount) / 100,
      availability:
        Number(productData.quantity_in_stock) > 0
          ? "IN_STOCK"
          : "OUT_OF_STOCK",
    },
  };
};

export const updateProduct = async (id, productData, imageFile) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Product not found."
    );
  }

  let newUploadedImage = null;
  const oldPublicId = product.image_public_id;

  try {
    const {
      name,
      description,
      category_id,
      price,
      quantity_in_stock,
      discount_percentage,
    } = productData;

    // Check category if one is being changed
    if (category_id && category_id !== product.category_id) {
      const category = await Category.findByPk(category_id);

      if (!category) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          "Category not found."
        );
      }
    }

    // Check duplicate name within category
    const finalName = name ?? product.name;
    const finalCategoryId = category_id ?? product.category_id;

    const duplicateProduct = await Product.findOne({
      where: {
        name: finalName,
        category_id: finalCategoryId,
      },
    });

    if (
      duplicateProduct &&
      duplicateProduct.id !== product.id
    ) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "A product with this name already exists in this category."
      );
    }

    // Upload new image only if supplied
    if (imageFile) {
      newUploadedImage = await uploadToCloudinary(imageFile);
    }

    // Generate new slug only when name changes
    let slug = product.slug;

    if (name && name !== product.name) {
      slug = `${slugify(name, {
        lower: true,
        strict: true,
      })}-${randomUUID().slice(0, 8)}`;
    }

    await product.update({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(category_id !== undefined && { category_id }),
      ...(price !== undefined && { price }),
      ...(quantity_in_stock !== undefined && {
        quantity_in_stock,
      }),
      ...(discount_percentage !== undefined && {
        discount_percentage,
      }),
      slug,

      ...(newUploadedImage && {
        image_url: newUploadedImage.image_url,
        image_public_id: newUploadedImage.public_id,
      }),
    });

    // Delete old image only AFTER database update succeeds
    if (newUploadedImage && oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }

    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    const productDataResponse = updatedProduct.toJSON();

    const finalPrice = Number(productDataResponse.price);
    const discount = Number(
      productDataResponse.discount_percentage
    );

    return {
      success: true,
      message: "Product updated successfully.",
      data: {
        ...productDataResponse,
        discounted_price:
          finalPrice - (finalPrice * discount) / 100,
        availability:
          Number(productDataResponse.quantity_in_stock) > 0
            ? "IN_STOCK"
            : "OUT_OF_STOCK",
      },
    };
  } catch (error) {
    // If new image was uploaded but DB operation failed,
    // remove the new image from Cloudinary.
    if (newUploadedImage?.public_id) {
      await deleteFromCloudinary(
        newUploadedImage.public_id
      );
    }

    throw error;
  }
};

export const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Product not found."
    );
  }

  await product.destroy();

  return {
    success: true,
    message: "Product deleted successfully.",
  };
};

