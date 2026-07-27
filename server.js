import express from "express";
import app from "./src/app.js"
// productService.js
import pool from "./src/config/db.js";


//define the port number on which the app will listen on
const PORT = 3000;


    //start the server 
app.listen(PORT, () => {
    console.log(`Server is runnung on Port ${PORT}`)
}
);
