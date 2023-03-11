import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { UserModel } from "../models/UserModel.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import {instance} from '../server.js'
import crypto from 'crypto' 
import {Payment} from '../models/Payment.js'


export const buySubscription = catchAsyncErrors(async(req,res,next)=>{
 const user = await UserModel.findById(req.user._id)
 if(user.role === "admin") return(next(new ErrorHandler("Admin can't buy Subscriptions",400)))
 
const plan_id = process.env.RAZORPAY_PLAN_ID || "plan_LAvjmXiJzW1NfR"
const subscription = await instance.subscriptions.create({
    plan_id,
    customer_notify: 1,
    total_count:12,  
 })
 user.subscription.id = subscription.id
 user.subscription.status = subscription.status
 await user.save()
 res.status(201)
 .json({
    success:true,
    subscriptionId : subscription.id
 })
} )


// ___________________________GET PAYMENT VERIFICATION _________________________

export const paymentVerification = catchAsyncErrors(async(req,res,next)=>{

const {razorpay_signature,razorpay_payment_id,razorpay_subscription_id} =req.body

const user = await UserModel.findById(req.user._id)
const subscription_id =user.subscription.id
const generated_signature = crypto.createHmac("sha256",process.env.RAZORPAY_API_SECRET).update(razorpay_payment_id+"|"+ subscription_id,'utf-8').digest("hex")

const isAuthentic = generated_signature === razorpay_signature
if(!isAuthentic)return (res.redirect(`${process.env.FRONTEND_URL}/paymentfail`))
//databaase comes here
await Payment.create({
   razorpay_signature,razorpay_payment_id,razorpay_subscription_id
})
user.subscription.status = "active"
   
   await user.save()
   res.redirect(`${
      process.env.FRONTEND_URL
   }/paymentsuccess?reference=${razorpay_payment_id}`)
  
  
  
  } )
// ___________________________GET RAZOR PAY KEY _________________________
  export const getRazorPayKey = catchAsyncErrors(async(req,res,next)=>{
   res.status(200).json({
      key:process.env.RAZORPAY_API_KEY
   })
  })

// ___________________________UNSUBSCRIBE/REFUND _________________________

  export const cancelSubscription = catchAsyncErrors(async(req,res,next)=>{
   const user = await UserModel.findById(req.user._id)
   const subscriptionId =  user.subscription.id
   let refund = false;
   await instance.subscriptions.cancel(subscriptionId)
   const payment  = await Payment.findOne({
      razorpay_subscription_id:subscriptionId
   })

   // const gap = Date.now()-payment.createdAt;
   // const RefundTime = process.env.REFUND_DAYS * 24 * 60 *60 *1000
   // if (RefundTime > gap) {
// await instance.payments.refund(payment.razorpay_payment_id)
// refund = true 
   // } 
   await payment.remove()
   user.subscription.id="undefined";
   user.subscription.status="undefined"
   await user.save()
   res.status(200).json({
      message:refund?"Subscription cancelled, You will recieve full refund with in 7 days.":"Subscription cancelled, No refund initiated as subscription was cancelled after 7 days",
      key:process.env.RAZORPAY_API_KEY
   })
  })
