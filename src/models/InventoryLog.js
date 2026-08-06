import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class InventoryLog extends Model {}

InventoryLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "products",
        key: "id",
      },
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "users",
        key: "id",
      },
    },

    quantity_change: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        notNull: {
          msg: "Quantity change is required.",
        },

        notZero(value) {
          if (value === 0) {
            throw new Error(
              "Quantity change cannot be zero."
            );
          }
        },
      },
    },

    reason: {
      type: DataTypes.ENUM(
        "RESTOCK",
        "ORDER",
        "DAMAGED",
        "ADJUSTMENT"
      ),

      allowNull: false,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,

      validate: {
        len: {
          args: [0, 1000],
          msg: "Notes cannot exceed 1000 characters.",
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

    modelName: "InventoryLog",

    tableName: "inventory_logs",

    timestamps: true,

    createdAt: "created_at",

    updatedAt: false,
  }
);

export default InventoryLog;