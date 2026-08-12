import { createOrder, getUserOrders, getOrderById,
            getAllOrders, updateOrderStatus, cancelOrder
 } from "../services/orderService.js";

export const createOrderController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await createOrder(
      userId,
      req.body.items
    );

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserOrdersController = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.id;

    const page = Math.max(
      Number.parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(req.query.limit, 10) || 10,
        1
      ),
      100
    );

    const result = await getUserOrders(
      userId,
      page,
      limit
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdController = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const result = await getOrderById(
      orderId,
      userId
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersController = async (req, res, next) => {
  try {
    const page = Math.max(
      Number.parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(req.query.limit, 10) || 10,
        1
      ),
      100
    );

    const result = await getAllOrders(
      page,
      limit
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusController = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const result = await updateOrderStatus(
      orderId,
      status
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const cancelOrderController = async (
  req,
  res,
  next
) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const result = await cancelOrder(
      orderId,
      userId
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};