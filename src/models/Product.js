import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,

      validate: {
        notEmpty: {
          msg: "Product name is required.",
        },
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,

      validate: {
        notEmpty: {
          msg: "Description is required.",
        },

        len: {
          args: [10, 2000],
          msg: "Description must be between 10 and 2000 characters.",
        },
      },
    },

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,

      validate: {
        min: {
          args: [0.01],
          msg: "Price must be greater than zero.",
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

    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        min: {
          args: [0],
          msg: "Stock quantity cannot be negative.",
        },
      },
    },

    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,

      validate: {
        isUrl: {
          msg: "Image URL must be a valid URL.",
        },
      },
    },

    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    // discounted_price: {
    //   type: DataTypes.VIRTUAL,

    //   get() {
    //     const price = Number(this.price);
    //     const discount = Number(this.discount_percentage ?? 0);

    //     return Number(
    //       (price * (1 - discount / 100)).toFixed(2)
    //     );
    //   },
    // },

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

    modelName: "Product",

    tableName: "products",

    timestamps: true,

    createdAt: "created_at",

    updatedAt: "updated_at",
  }
);

export default Product;