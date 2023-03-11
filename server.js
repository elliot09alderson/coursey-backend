import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from 'cloudinary'
import Razorpay from 'razorpay'
import nodeCron from 'node-cron'
import {Stats} from './models/Stats.js'

connectDB()

export var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET
})
nodeCron.schedule("0 0 0 1 * * ",async()=>{
  try {
    await Stats.create({})
  } catch (error) {
    console.log(error)
  }
  console.log("A")
})

app.get("/test",(req,res)=>{
  res.json("hello bro");
})


app.listen(process.env.PORT,()=>{
console.log(`server is running on port  ${process.env.PORT}` )
})