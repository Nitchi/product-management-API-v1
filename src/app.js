import express from "express";

//create an express application
const app = express(); 
 
 //middleware
app.use(express.json());
// app.use()

  
//first route
app.get("/", (req, res) => {
    res.send("Product Manager API is running successfully!");
});

export default app