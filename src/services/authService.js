import bcrypt from "bcrypt";
import { User, Role } from "../models/index.js";
import generateToken from "../utils/generateToken.js";
import ApiError from "../utils/ApiError.js";

const createUser = async (userData, roleName) => {
  const {
    first_name,
    last_name,
    email,
    password,
  } = userData;

  // Check email
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "Email already exists."
    );
  }

  // Get Role
  const role = await Role.findOne({
    where: {
      name: roleName,
    },
  });

  if (!role) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      `${roleName} role not found.`
    );
  }

  // Hash Password
  const password_hash = await bcrypt.hash(password, 12);

  // Create User
  const user = await User.create({
    first_name,
    last_name,
    email,
    password_hash,
    role_id: role.id,
  });

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: role.name,
  };
};

    //Register Customer

export const registerUser = async (userData) => {

  const user = await createUser(
    userData,
    "CUSTOMER"
  );

  return {
    success: true,
    message: "Registration successful.",
    data: user,
  };
};

    //Log In

export const loginUser = async (email, password) => {

  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        as: "role",
      },
    ],
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user);

  return {
    success: true,
    message: "Login successful.",
    token,
    data: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role.name,
    },
  };
};    


export const createAdmin = async (userData) => {

  const admin = await createUser(
    userData,
    "ADMIN"
  );

  return {
    success: true,
    message: "Admin created successfully.",
    data: admin,
  };
};