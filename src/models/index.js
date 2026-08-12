import Role from "./Role.js";
import User from "./User.js";
import Category from "./Category.js";
import Product from "./Product.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import Review from "./Review.js";
import InventoryLog from "./InventoryLog.js";

// Role ↔ User

Role.hasMany(User, {
  foreignKey: "role_id",
  as: "users",
});

User.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});

// Category ↔ Product

Category.hasMany(Product, {
  foreignKey: "category_id",
  as: "products",
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

// User ↔ Order

User.hasMany(Order, {
  foreignKey: "user_id",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "user_id",
  as: "customer",
});

// Order ↔ OrderItem

Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  as: "items",
});

OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
});

// Product ↔ OrderItem

Product.hasMany(OrderItem, {
  foreignKey: "product_id",
  as: "orderItems",
});

OrderItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

// User ↔ Review

User.hasMany(Review, {
  foreignKey: "user_id",
  as: "reviews",
});

Review.belongsTo(User, {
  foreignKey: "user_id",
  as: "customer",
});

// Product ↔ Review

Product.hasMany(Review, {
  foreignKey: "product_id",
  as: "reviews",
});

Review.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

// User ↔ InventoryLog

User.hasMany(InventoryLog, {
  foreignKey: "user_id",
  as: "inventoryLogs",
});

InventoryLog.belongsTo(User, {
  foreignKey: "user_id",
  as: "admin",
});

// Product ↔ InventoryLog

Product.hasMany(InventoryLog, {
  foreignKey: "product_id",
  as: "inventoryLogs",
});

InventoryLog.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

Review.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});



export {
  Role,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Review,
  InventoryLog,
};