import express from "express";
import { buySubscription, getRazorPayKey, paymentVerification } from "../controllers/paymentControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";


const paymentRouter = express.Router()
paymentRouter.route("/subscribe").post(isAuthenticated,buySubscription)
paymentRouter.route("/paymentverification").post(isAuthenticated,paymentVerification)
paymentRouter.route("/getrazorpaykey").get(isAuthenticated,getRazorPayKey)
paymentRouter.route("/subscribe/cancel").delete(isAuthenticated,getRazorPayKey)

export default paymentRouter
