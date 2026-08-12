import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Review extends Model {}

Review.init(
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

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "products",
        key: "id",
      },
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,

      validate: {
        min: {
          args: [1],
          msg: "Rating must be at least 1.",
        },

        max: {
          args: [5],
          msg: "Rating cannot exceed 5.",
        },
      },
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: false,

      validate: {
        notEmpty: {
          msg: "Comment is required.",
        },

        len: {
          args: [10, 1000],
          msg: "Comment must be between 10 and 1000 characters.",
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

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  
  },

  {
    sequelize,

    modelName: "Review",

    tableName: "reviews",

    timestamps: true,

    createdAt: "created_at",

    paranoid: true,

    updatedAt: "updated_at",

    indexes: [
      {
        unique: true,

        fields: ["user_id", "product_id"],
      },
    ],
  }
);



export default Review;