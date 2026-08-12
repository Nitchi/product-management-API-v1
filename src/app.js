import express from "express";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import productReviewRoutes from "./routes/productReviewRoutes.js";
import adminReviewRoutes from "./routes/adminReviewRoutes.js";

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
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin/orders", adminOrderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/products", productReviewRoutes);
app.use("/api/v1/admin", adminReviewRoutes);
app.use("/api/v1/categories", categoryRoutes);


app.use(errorMiddleware);

export default app