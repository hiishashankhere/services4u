import express from 'express'
import {connect} from './config/database.js'
import dotenv from 'dotenv'
import userRouter from './routes/user.js'
import serviceRouter from './routes/service.js'
import cookieParser from 'cookie-parser'
import Razorpay from 'razorpay'

const app = express()

//database coonection
connect()

//env variables
dotenv.config({
    path:'config/config.env'
})
//razorpay instance
export const instance = new Razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_SECRET_KEY
})


//middlewares
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1",userRouter)
app.use("/api/v1",serviceRouter)

const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`server started running on:${PORT}`);
})