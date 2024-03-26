// getting details from contact form

import { Contact } from "../models/contact.js"

export const contact = async(req,res)=>{
    try {
      const {name,email,mobile,message} = req.body
      const userId = req.user._id
      let contactus = await Contact.findOne({email})
       contactus = {
        name,email,mobile,message,
        user:userId
      }
  
      contactus = await Contact.create({
        name,email,mobile,message,
        user:userId
      })
  
      res.status(201).json({
        success:true,
        contactus
      })
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }