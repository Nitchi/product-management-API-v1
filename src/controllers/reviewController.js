import {
  createReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
  adminDeleteReview,
} from "../services/reviewService.js";

import { getPagination } from "../utils/pagination.js";


/*
 * Create a review
 */
export const createReviewController = async (
  req,
  res,
  next
) => {
  try {
    const { productId } = req.params;

    const {
      rating,
      comment,
    } = req.body;

    const userId = req.user.id;

    const result = await createReview(
      userId,
      Number(productId),
      rating,
      comment
    );

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};


/*
 * Get all reviews for a product
 */
export const getProductReviewsController = async (
  req,
  res,
  next
) => {
  try {
    const productId = Number(
      req.params.productId
    );

    const { page, limit } =
      getPagination(req.query);

    const {
      sortBy,
      sortOrder,
    } = req.query;

    const result = await getProductReviews({
      productId,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


/*
 * Get one review
 */
export const getReviewByIdController = async (
  req,
  res,
  next
) => {
  try {
    const reviewId = Number(
      req.params.id
    );

    const result =
      await getReviewById(reviewId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


/*
 * Update customer's own review
 */
export const updateReviewController = async (
  req,
  res,
  next
) => {
  try {
    const reviewId = Number(
      req.params.id
    );

    const userId = req.user.id;

    const result = await updateReview(
      reviewId,
      userId,
      req.body
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


/*
 * Delete customer's own review
 */
export const deleteReviewController = async (
  req,
  res,
  next
) => {
  try {
    const reviewId = Number(
      req.params.id
    );

    const userId = req.user.id;

    const result = await deleteReview(
      reviewId,
      userId
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


/*
 * Admin delete review
 */
export const adminDeleteReviewController = async (
  req,
  res,
  next
) => {
  try {
    const reviewId = Number(
      req.params.id
    );

    const result =
      await adminDeleteReview(reviewId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};