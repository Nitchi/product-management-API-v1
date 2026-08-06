import express from "express";
import app from "./src/app.js"
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("✅ Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Unable to connect to the database:");
    console.error(error.message);
  }
}

startServer();