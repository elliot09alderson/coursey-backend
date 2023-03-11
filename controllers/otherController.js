import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Stats } from "../models/Stats.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
export const contact =  catchAsyncErrors (async (req,res,next)=>{
    const {name,email,message} = req.body
    if(!email || !name || !message) {
        return next(new ErrorHandler("please fill all the fields",400))
    }
    const to = process.env.MY_MAIL;
    const subject = "Contact from coursey"
    const text = `I am ${name} and my email is ${email}. \n${message}`
    await sendEmail(to,subject,text)
    res.status(200).json({
        success:true,
        message:"your message has been sent."
    })
})  

export const courseRequest = catchAsyncErrors(async(req,res,next)=>{
const {name, email,course}  = req.body
if(!email || !name || !course) {
    return next(new ErrorHandler("please fill all the fields",400))
}
    const to = process.env.MY_MAIL;
    const subject = "Requesting for a course on coursey"
    const text = `I am ${name} and my Email is ${email}. \n${course}`
    await sendEmail(to,subject,text);
    res.status(200).json({
        success:true,
        message:"Your request has been sent"
    })
})


export const getDashboardStats = catchAsyncErrors(async(req,res,next)=>{
   const stats = await Stats.find({}).sort({createdAt:"desc"}).limit(12)
    const statsData = []
    const reqiredSize = 12 - stats.length 
    for(let i =0;i<stats.length;i++){
        statsData.push(stats[i])
    }
    for(let i =0;i<reqiredSize;i++){
        statsData.unshift({
            users:0,
            subscriptions:0,
            views:0
        })
    }

    
    const usersCount  = statsData[11].users
    const viewsCount = statsData[11].views
    const subscriptionsCount = statsData[11].subscriptions
    let usersProfitPercentage =0
    let viewsProfitPercentage=0
    let subscriptionsProfitPercentage=0
    let usersProfit = true,
    viewsProfit  = true,
    subscriptionsProfit = true

    if(statsData[10].users===0) usersProfitPercentage = usersCount * 100
    if(statsData[10].views===0) viewsProfitPercentage = usersCount * 100
    if(statsData[10].subscriptions===0) subscriptionsProfitPercentage = usersCount * 100

    else{
        const difference={
            users:statsData[11].users- statsData[10].users,
            views:statsData[11].views- statsData[10].views,
            subscriptions:statsData[11].subscriptions- statsData[10].subscriptions
        }

        usersProfitPercentage = difference.users/statsData[10].users*100
        viewsProfitPercentage = difference.views/statsData[10].views*100
        subscriptionsProfitPercentage = difference.subscriptions/statsData[10].subscriptions*100

        if(usersProfitPercentage<0)usersProfit = false
        if(viewsProfitPercentage<0)viewsProfit = false
        if(subscriptionsProfitPercentage<0)subscriptionsProfit= false
    }

        res.status(200).json({
            success:true,
            stats:statsData,
            viewsCount,usersCount,subscriptionsCount,
            viewsProfitPercentage,usersProfitPercentage,subscriptionsProfitPercentage
        })
    })
    
