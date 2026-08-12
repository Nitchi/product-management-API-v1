import express from "express";
import app from "./src/app.js"
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();


    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
  
  }
}

startServer();