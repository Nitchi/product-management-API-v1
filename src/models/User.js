import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/db.js";

class User extends Model {
  // Compare plain password with stored hash
  async isValidPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  // Exclude password hash from API responses
  toJSON() {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "First name is required.",
        },
      },
    },

    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Last name is required.",
        },
      },
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Email is required.",
        },
        isEmail: {
          msg: "Please provide a valid email address.",
        },
      },
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: "User",
    tableName: "users",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    hooks: {
      async beforeCreate(user) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
      },

      async beforeUpdate(user) {
        if (user.changed("password_hash")) {
          user.password_hash = await bcrypt.hash(user.password_hash, 12);
        }
      },
    },
  }
);

export default User;