import express from "express";
import { adminSide, isAuthenticated, ispremium } from "../middlewares/auth.js";
import {
  assignjob,
  createJob,
  employee,
  getAllemployee,
  getJobs,
} from "../controllers/job.js";

const router = express.Router();

//only premium members cal apply for job
// router.post("/employee",isAuthenticated,ispremium,employee)

//admin can see all employees
// router.get("/allemployee",isAuthenticated,adminSide,getAllemployee)

//admin assigning job to the employee
// router.post("/assignjob/:id",isAuthenticated,adminSide,assignjob)

router.post("/create/job", isAuthenticated, adminSide, createJob);
router.get("/jobs", isAuthenticated, adminSide, getJobs);

export default router;
