import express from 'express'
import { adminSide, isAuthenticated } from '../middlewares/auth.js'
import { createjob, getAllJob } from '../controllers/job.js'

const router = express.Router()

router.post("/job",isAuthenticated,adminSide,createjob)
router.get("/alljob",isAuthenticated,getAllJob)


export default router