import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token)
      return res.status(404).json({
        success: false,
        message: "login first",
      });
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//admin access only
export const adminSide = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(404).json({
      success: false,
      message: "only admin is allowed",
    });
  }
  next();
};

//only premium user
export const ispremium = async(req,res)=>{
  if(req.user.isPremium !== true){
    return res.status(404).json({
      success:false,
      message:"only premium members are allowed"
    })
  }
}
