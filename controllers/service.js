import { instance } from "../index.js"
import { Payment } from "../models/payment.js"
import { Service } from "../models/service.js"
import ApiFeatures from "../utils/apifeatures.js"
import crypto from 'crypto'

export const createService = async (req, res) => {
    try {
        const { name, description, price, image, category, reviews } = req.body

        const services = {
            name,
            description,
            price,
            image,
            category,
            reviews
        }

        const options ={
            amount:Number(price)*100,
            currency:"INR"
        }
        const order = await instance.orders.create(options)
        
        res.status(201).json({
            success: true,
            order,services,
            message: "service added successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//payment verification
export const paymentverification =  async(req,res,next)=>{
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature, services} = req.body

        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET_KEY).update(body).digest("hex")
        const isAuthentic = expectedSignature === razorpay_signature

        if(isAuthentic){
            const payment = await Payment.create({
                razorpay_order_id,
                razorpay_payment_id, 
                razorpay_signature
            })
            await Service.create({
                ...services,paidat:new Date(Date.now()),
                paymentinfo:payment._id
            })

            res.status(201).json({
                success:true,
                message:`order placed successfully Payment ID ${payment._id}`
            })

        }else{
            return next(res.status(404).json({
                success:false,
                message:"payment failed"
            }))
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


export const allServices = async (req, res) => {
    try {
        const apiFeatures = new ApiFeatures(Service.find(), req.query).search().fliter()
        const service = await apiFeatures.query
        res.status(200).json({
            success: true,
            service
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get service details

export const getServiceDetails = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)

        if (!service) return res.status(404).json({
            success: false,
            message: "service not found"
        })

        res.status(200).json({
            success: true,
            service
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateServices = async (req, res) => {
    try {
        let service = await Service.findById(req.params.id)
        if (!service) return res.status(404).json({
            success: false,
            message: "service not found"
        })

        service = await Service.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({
            success: true,
            message: "service updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteService = async (req, res) => {
    try {
        let service = await Service.findById(req.params.id)
        if (!service) return res.status(404).json({
            success: false,
            message: "service not found"
        })

        service = await Service.findByIdAndDelete(req.params.id, req.body)
        res.status(200).json({
            success: true,
            message: "service deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//reviews section
export const createReview = async (req, res) => {
    try {
        const { rating, comments, serviceId } = req.body
        const review = {
            name: req.user ?req.user.name : "unknown",
            user: req.user ?req.user._id : "unknown",
            rating: Number(rating),
            comments
        }
        //console.log(req.user);

        const service = await Service.findById(serviceId)
        //console.log(service);

        const isReviewed = service.reviews.find((rev) => rev.user && rev.user.toString() === (req.user ? req.user._id.toString() : "Unknown"));
        console.log(isReviewed);
        if (isReviewed) {
            service.reviews.forEach((rev) => {
                if (rev.user && rev.user.toString() === (req.user ? req.user._id.toString() : "Unknown")) {
                    rev.rating = rating;
                    rev.comments = comments;
                }
            });
        } else {
            service.reviews.push(review)
            service.numOfReviews = service.reviews.length
        }
        

        let avg = 0;
        service.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        service.ratings = avg / service.reviews.length;
    
        await service.save();

        res.status(200).json({
            success: true,
            message: "reviews updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}