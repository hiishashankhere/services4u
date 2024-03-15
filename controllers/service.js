import { Service } from "../models/service.js"
import ApiFeatures from "../utils/apifeatures.js"

export const createService = async (req, res) => {
    try {
        const { name, description, price, image, category, reviews } = req.body
        await Service.create({
            name,
            description,
            price,
            image,
            category,
            reviews
        })
        res.status(201).json({
            success: true,
            message: "service added successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
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