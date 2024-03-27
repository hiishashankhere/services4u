import express from 'express'
import { adminSide, isAuthenticated,ispremium} from '../middlewares/auth.js'
import { assignjob, employee, getAllemployee } from '../controllers/job.js'

const router = express.Router()

//only premium members cal apply for job
router.post("/employee",isAuthenticated,ispremium,employee)

//admin can see all employees 
router.get("/allemployee",isAuthenticated,adminSide,getAllemployee)

//admin assigning job to the employee
router.post("/assignjob/:id",isAuthenticated,adminSide,assignjob)

export default router