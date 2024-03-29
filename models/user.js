import express from 'express'
import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Please enter valid email"],
        unique:true,
        validate:[validator.isEmail,"Please enter the valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter the password"],
        minLength:4
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    image:{
        public_id:String,
        url:String
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
},{timestamps:true})


userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next()
})

//compare password
userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateToken = async function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET_KEY)
}

//generating reset token for password changing
userSchema.methods.generateResetToken = function(){
   //reser token
   const resetToken = crypto.randomBytes(20).toString("hex")
   //hasing and adding to userschema
   this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
   this.resetPasswordExpire = Date.now() +15*60*1000
   return resetToken
}

export const User = mongoose.model("User",userSchema)