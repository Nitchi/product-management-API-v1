import express from "express";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

//create an express application
const app = express(); 
 
 //middleware
app.use(express.json());
// app.use()

  
//first route
app.get("/", (req, res) => {
    res.send("Product Manager API is running successfully!");
});
app.use("/api/v1/auth", authRoutes);


app.use(errorMiddleware);

export default app