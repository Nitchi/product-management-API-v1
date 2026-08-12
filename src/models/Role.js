import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,

      validate: {
        notEmpty: {
          msg: "Role name cannot be empty.",
        },

        isIn: {
          args: [["ADMIN", "CUSTOMER"]],
          msg: "Role must be either ADMIN or CUSTOMER.",
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
    modelName: "Role",
    tableName: "roles",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Role;