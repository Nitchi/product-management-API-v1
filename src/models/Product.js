import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "categories",
        key: "id",
      },
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,

      validate: {
        min: {
          args: [0.01],
          msg: "Price must be greater than zero.",
        },
      },
    },

    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,

      validate: {
        min: {
          args: [0],
          msg: "Quantity in stock cannot be negative.",
        },
      },
    },

    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,

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

    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    image_public_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },

  {
    sequelize,

    modelName: "Product",

    tableName: "products",

    underscored: true,

    timestamps: true,

    createdAt: "created_at",

    updatedAt: "updated_at",

    paranoid: true,

    deletedAt: "deleted_at",
  }
);

export default Product;