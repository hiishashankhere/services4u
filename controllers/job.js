import { Job } from "../models/job.js"

export const employee = async (req, res) => {
    try {
        const { jobtitle, description } = req.body
        const createdBy = req.user._id
        const job = await Job.create({
            jobtitle, description, createdBy
        })
        res.status(201).json({
            success: true,
            message: "job application submitted successfully",
            job
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllemployee = async (req, res) => {
    try {
        const job = await Job.find()
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//assigning job to the employees

export const assignjob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job) return res.status(404).json({
            success: false,
            message: "no job found with this id"
        })
        const jobtitle = job.jobtitle
        const description = job.description
        
        res.status(200).json({
            success:true,
            message:`Your job application for ${jobtitle} with ${description} is approved successfully`
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}