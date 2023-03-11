import jwt from 'jsonwebtoken'
import { UserModel } from '../models/UserModel.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import { catchAsyncErrors } from './catchAsyncErrors.js'

export const isAuthenticated= catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token) return next( new ErrorHandler("Please login ",401))
    const decode = jwt.verify(token,process.env.JWT_SECRET)
    //console.log(decode)
    // console.log(req.cookies)
    req.user = await UserModel.findById(decode._id)
    next()
})


export const authorizedAdmin= (req,res,next)=>{
  if(req.user.role !== "admin") return next(new ErrorHandler(`${req.user.role} is not allowed to access this resource`,403))
  next()
}



export const authorzeSubscribers= (req,res,next)=>{
  if(req.user.subscription.status !== "active" && req.user.role !=="admin") return next(new ErrorHandler(`Only Subscriber can access this resource`,403))
  next()
}