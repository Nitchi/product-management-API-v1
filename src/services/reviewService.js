import Review from "../models/review.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import User from "../models/user.js";

import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";


/*
 * Create a review
 */
export const createReview = async (
  userId,
  productId,
  rating,
  comment
) => {
  /*
   * Check that the product exists.
   * Because Product uses paranoid/soft delete,
   * deleted products will not be found here.
   */
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Product not found."
    );
  }

  /*
   * Check whether the user has a DELIVERED order
   * containing this product.
   */
  const purchasedProduct =
    await OrderItem.findOne({
      where: {
        product_id: productId,
      },

      include: [
        {
          model: Order,
          as: "order",

          where: {
            user_id: userId,
            status: "DELIVERED",
          },

          attributes: [],
        },
      ],
    });

  if (!purchasedProduct) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can only review products you have purchased and received."
    );
  }

  /*
   * Prevent duplicate reviews.
   *
   * The database also has a UNIQUE constraint on
   * product_id + user_id, so this check gives the
   * customer a friendly error before PostgreSQL
   * catches it.
   */
  const existingReview =
    await Review.findOne({
      where: {
        product_id: productId,
        user_id: userId,
      },
    });

  if (existingReview) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "You have already reviewed this product."
    );
  }

  const review = await Review.create({
    product_id: productId,
    user_id: userId,
    rating,
    comment: comment ?? null,
  });

  return {
    success: true,
    message: "Review created successfully.",
    data: review,
  };
};


/*
 * Get reviews for a product
 */
export const getProductReviews = async ({
  productId,
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortOrder = "DESC",
}) => {
  /*
   * Make sure the product exists.
   */
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Product not found."
    );
  }

  const offset = (page - 1) * limit;

  /*
   * Only allow approved sorting fields.
   */
  const allowedSortFields = [
    "created_at",
    "rating",
  ];

  const safeSortBy =
    allowedSortFields.includes(sortBy)
      ? sortBy
      : "created_at";

  const safeSortOrder =
    String(sortOrder).toUpperCase() === "ASC"
      ? "ASC"
      : "DESC";

  const {
    count,
    rows: reviews,
  } = await Review.findAndCountAll({
    where: {
      product_id: productId,
    },

    include: [
      {
        model: User,
        as: "user",
        attributes: [
          "id",
          "first_name",
          "last_name",
        ],
      },
    ],

    order: [
      [safeSortBy, safeSortOrder],
    ],

    limit,
    offset,

    distinct: true,
  });

  return {
    success: true,

    data: reviews,

    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: count,
      totalPages: Math.ceil(
        count / limit
      ),
    },
  };
};


/*
 * Get one review
 */
export const getReviewById = async (reviewId) => {
  const review = await Review.findByPk(
    reviewId,
    {
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "first_name",
          "last_name",
          ],
        },

        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "name",
            "image_url",
          ],
        },
      ],
    }
  );

  if (!review) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Review not found."
    );
  }

  return {
    success: true,
    data: review,
  };
};


/*
 * Update customer's own review
 */
export const updateReview = async (
  reviewId,
  userId,
  updates
) => {
  const review = await Review.findOne({
    where: {
      id: reviewId,
      user_id: userId,
    },
  });

  if (!review) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Review not found."
    );
  }

  const allowedUpdates = {};

  if (updates.rating !== undefined) {
    allowedUpdates.rating = updates.rating;
  }

  if (updates.comment !== undefined) {
    allowedUpdates.comment =
      updates.comment;
  }

  await review.update(allowedUpdates);

  return {
    success: true,
    message: "Review updated successfully.",
    data: review,
  };
};


/*
 * Soft-delete customer's own review
 */
export const deleteReview = async (
  reviewId,
  userId
) => {
  const review = await Review.findOne({
    where: {
      id: reviewId,
      user_id: userId,
    },
  });

  if (!review) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Review not found."
    );
  }

  await review.destroy();

  return {
    success: true,
    message: "Review deleted successfully.",
  };
};


/*
 * Admin review deletion
 */
export const adminDeleteReview = async (
  reviewId
) => {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Review not found."
    );
  }

  await review.destroy();

  return {
    success: true,
    message: "Review deleted successfully.",
  };
};