import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "orders",
        key: "id",
      },
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "products",
        key: "id",
      },
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        min: {
          args: [1],
          msg: "Quantity must be at least 1.",
        },
      },
    },

    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,

      validate: {
        min: {
          args: [0.01],
          msg: "Unit price must be greater than zero.",
        },
      },
    },

    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,

      validate: {
        min: {
          args: [0],
          msg: "Discount cannot be negative.",
        },

        max: {
          args: [100],
          msg: "Discount cannot exceed 100%.",
        },
      },
    },

    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,

      validate: {
        min: {
          args: [0],
          msg: "Subtotal cannot be negative.",
        },
      },
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },

  {
    sequelize,

    modelName: "OrderItem",

    tableName: "order_items",

    timestamps: true,

    createdAt: "created_at",

    updatedAt: false,
  }
);

export default OrderItem;