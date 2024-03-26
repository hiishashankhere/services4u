import { Job } from "../models/job.js"

export const createjob = async (req, res) => {
    try {
        const { jobtitle, description } = req.body
        const createdBy = req.user._id
        const job = await Job.create({
            jobtitle, description, createdBy
        })
        res.status(201).json({
            success: true,
            message:"job created successfully",
            job
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllJob = async(req,res)=>{
    try {
        const job = await Job.find()
        res.status(200).json({
            success:true,
            job
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
} 