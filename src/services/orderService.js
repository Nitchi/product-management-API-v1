import { Order, OrderItem, Product } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import sequelize from "../config/database.js";

const generateOrderNumber = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const randomPart = Math.floor(100000 + Math.random() * 900000);

  return `ORD-${year}${month}${day}-${randomPart}`;
};


export const createOrder = async (userId, items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Order must contain at least one product."
    );
  }

  // Combine duplicate products
  const combinedItems = new Map();

  for (const item of items) {
    const productId = Number(item.product_id);
    const quantity = Number(item.quantity);

    if (!productId || !quantity || quantity < 1) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Each order item must have a valid product_id and quantity."
      );
    }

    if (combinedItems.has(productId)) {
      combinedItems.set(
        productId,
        combinedItems.get(productId) + quantity
      );
    } else {
      combinedItems.set(productId, quantity);
    }
  }

  const transaction = await sequelize.transaction();

  try {
    let totalAmount = 0;
    const orderItems = [];

    for (const [productId, requestedQuantity] of combinedItems) {
      const product = await Product.findByPk(productId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!product) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          `Product with ID ${productId} not found.`
        );
      }

      if (product.quantity_in_stock < requestedQuantity) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          `Insufficient stock for "${product.name}". Available stock: ${product.quantity_in_stock}.`
        );
      }

      const unitPrice = Number(product.price);

      const discountPercentage = Number(
        product.discount_percentage || 0
      );

      const discountedUnitPrice =
        unitPrice -
        (unitPrice * discountPercentage) / 100;

      const subtotal =
        discountedUnitPrice * requestedQuantity;

      totalAmount += subtotal;

      orderItems.push({
        product,
        product_id: productId,
        quantity: requestedQuantity,
        unit_price: unitPrice,
        discount_percentage: discountPercentage,
        subtotal,
      });
    }

    const orderNumber = generateOrderNumber();

    const order = await Order.create(
      {
        user_id: userId,
        order_number: orderNumber,
        status: "PENDING",
        total_amount: totalAmount,
      },
      { transaction }
    );

    for (const item of orderItems) {
      await OrderItem.create(
        {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_percentage: item.discount_percentage,
          subtotal: item.subtotal,
        },
        { transaction }
      );

      await item.product.update(
        {
          quantity_in_stock:
            item.product.quantity_in_stock -
            item.quantity,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return {
      success: true,
      message: "Order created successfully.",
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: Number(order.total_amount),
      },
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

export const getUserOrders = async (
  userId,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  const { count, rows: orders } =
    await Order.findAndCountAll({
      where: {
        user_id: userId,
      },

      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
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
        },
      ],

      order: [["created_at", "DESC"]],

      limit,
      offset,

      distinct: true,
    });

  return {
    success: true,

    data: orders,

    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

export const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({
    where: {
      id: orderId,
      user_id: userId,
    },

    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
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
      },
    ],
  });

  if (!order) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Order not found."
    );
  }

  return {
    success: true,
    data: order,
  };
};

export const getAllOrders = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows: orders } =
    await Order.findAndCountAll({
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
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
        },
      ],

      order: [["created_at", "DESC"]],

      limit,
      offset,

      distinct: true,
    });

  return {
    success: true,

    data: orders,

    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

export const updateOrderStatus = async (orderId, status) => {
  const allowedStatuses = [
    "PENDING",
    "PROCESSING",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Invalid order status."
    );
  }

  const validTransitions = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["DELIVERED", "CANCELLED"],
  };

  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Order not found."
      );
    }

    // Check whether this status transition is allowed
    const allowedNextStatuses =
      validTransitions[order.status] || [];

    if (!allowedNextStatuses.includes(status)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Cannot change order status from ${order.status} to ${status}.`
      );
    }

    // Restore stock when cancelling the order
    if (status === "CANCELLED") {
      for (const item of order.items) {
        const product = await Product.findByPk(
          item.product_id,
          {
            transaction,
            lock: transaction.LOCK.UPDATE,
          }
        );

        if (!product) {
          throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            `Product with ID ${item.product_id} no longer exists.`
          );
        }

        await product.update(
          {
            quantity_in_stock:
              product.quantity_in_stock + item.quantity,
          },
          { transaction }
        );
      }
    }

    await order.update(
      {
        status,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      success: true,
      message: "Order status updated successfully.",
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        status: order.status,
      },
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

export const cancelOrder = async (orderId, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findOne({
      where: {
        id: orderId,
        user_id: userId,
      },

      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],

      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Order not found."
      );
    }

    if (order.status === "CANCELLED") {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Order has already been cancelled."
      );
    }

    if (order.status === "DELIVERED") {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "A delivered order cannot be cancelled."
      );
    }

    /*
     * Restore stock for every item in the order.
     */
    for (const item of order.items) {
      const product = await Product.findByPk(
        item.product_id,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (!product) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          `Product with ID ${item.product_id} no longer exists.`
        );
      }

      await product.update(
        {
          quantity_in_stock:
            product.quantity_in_stock + item.quantity,
        },
        { transaction }
      );
    }

    /*
     * Change order status only after stock
     * restoration succeeds.
     */
    await order.update(
      {
        status: "CANCELLED",
      },
      { transaction }
    );

    await transaction.commit();

    return {
      success: true,
      message: "Order cancelled successfully.",
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        status: order.status,
      },
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};