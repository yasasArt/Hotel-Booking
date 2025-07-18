import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";


connectDB()


const app = express()
app.use(cors()) // Enable cross-origin Resource Sharing


app.get('/',(req, res)=> res.send("Api is working "))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Sever running on port ${PORT}`));