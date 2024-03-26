import mongoose from 'mongoose'

export const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true,"please provide your email"]
    },
    mobile:{
        type:Number,
        minlength:10
    },
    message:{
        type:String
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Contact = mongoose.model("Contact",schema)