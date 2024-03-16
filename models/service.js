import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide the service"],
        minLength:[5,"name should be more than 5 characters"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please provide the description for the service"]
    },
    price:{
        type:Number,
        required:[true,"please enter the service charge"],
        maxLength:[8,"charge should not be greater than 8 figures"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"please provide the service category"]
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comments:{
                type:String,
                required:true
            },
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                //required:true
            }
        }
    ],
    paymentinfo:{
        type:mongoose.Schema.ObjectId,
        ref:"Payment"
    },
    paidat:Date
},{timestamps:true})

export const Service = mongoose.model("Service",serviceSchema)