import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import BCrypt from 'bcrypt'
import crypto from 'crypto'
import { userInfo } from "os";
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minLength: [7, "password should be at least of 7 characters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  subscription: {
    id: String,
    status: String,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: { type: String, required: true },
  },
  playlist: [{
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseModel"
    },poster:String,
  }],
  cratedAt: {
    type:Date,
    default:Date.now, 
  },
  resetPasswordToken:String,
  resetPasswordExpire:String
});

schema.pre("save",async function(next){
  if(!this.isModified('password')) return next()
this.password = await BCrypt.hash(this.password,10)
next()
})

schema.methods.getJWTToken=function(){
  return jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"15d"})
}


schema.methods.comparePassword= async function(password){
return await BCrypt.compare(password,this.password)
}

schema.methods.getResetToken=async function(){
const resetToken = crypto.randomBytes(20).toString("hex")

this.resetPasswordToken =crypto.createHash('sha256').update(resetToken).digest("hex")

this.resetPasswordExpire=Date.now()+15*60*1000
return resetToken
}
export const UserModel = mongoose.model("User", schema);
