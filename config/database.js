import mongoose from "mongoose";

mongoose.set('strictQuery', true)



export const connectDB = async()=>{
 const {connection} =  await mongoose.connect(process.env.MONGO_URI)
  console.log(`server running on port : ${connection.host}`)
 
} 