import express from 'express'
import cookieparser from 'cookie-parser'
import { config } from "dotenv";
import courseRouter from './routes/CourseRoutes.js';
import userRouter from './routes/UserRoutes.js';
import ErrorMiddleware from './middlewares/Error.js';
import paymentRouter from './routes/PaymentRouters.js'
import otherRoutes from './routes/OtherRoutes.js'
import cors from 'cors'
config({
    path:"./config/config.env"
});
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}))

app.use('/api/v1',courseRouter)
app.use('/api/v1',userRouter)
app.use('/api/v1',paymentRouter)
app.use('/api/v1',otherRoutes)

export default app
app.get("/",(req,res)=>{
    res.send(`<h1>Site is working. click <a href=${process.env.FRONTEND_URL}>here</a>to visit frontend</h1>`)
})
app.use(ErrorMiddleware)