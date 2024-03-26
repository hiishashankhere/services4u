import mongoose from 'mongoose'

export const schema = new mongoose.Schema({
    jobtitle:{      // here the admin need to add the category name same as the category in service model
        type:String,
        required:true
    },
    description:{    //here the admin need to add the service name same as the category in service model
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

export const Job = mongoose.model("Job",schema)