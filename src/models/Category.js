import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,

      unique: true,

      validate: {
        notEmpty: {
          msg: "Category name is required.",
        },

        len: {
          args: [2, 100],
          msg: "Category name must be between 2 and 100 characters.",
        },
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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

    modelName: "Category",

    tableName: "categories",

    timestamps: true,

    createdAt: "created_at",

    updatedAt: "updated_at",

    paranoid: true,

    deletedAt: "deleted_at",
  }

  
);

export default Category;