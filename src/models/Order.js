import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "users",
        key: "id",
      },
    },

    order_number: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "PROCESSING",
        "DELIVERED",
        "CANCELLED"
      ),

      allowNull: false,

      defaultValue: "PENDING",
    },

    total_amount: {
      type: DataTypes.DECIMAL(12, 2),

      allowNull: false,

      validate: {
        min: {
          args: [0],
          msg: "Total amount cannot be negative.",
        },
      },
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },

  {
    sequelize,

    modelName: "Order",

    tableName: "orders",

    timestamps: true,

    createdAt: "created_at",

    updatedAt: "updated_at",
  }
);

export default Order;