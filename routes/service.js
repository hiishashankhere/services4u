import express from 'express'
import { allServices, createReview, createService, deleteService, getServiceDetails, paymentverification, updateServices } from '../controllers/service.js'
import { adminSide,isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

router.post("/create",isAuthenticated,createService)
router.post("/paymentverification",isAuthenticated,paymentverification)
router.get("/all",isAuthenticated,allServices)
router.get("/details/:id",isAuthenticated,getServiceDetails)
router.put("/update/:id",isAuthenticated,adminSide,updateServices)
router.delete("/delete/:id",isAuthenticated,adminSide,deleteService)

//reviews
router.put("/reviews",isAuthenticated,createReview)
export default router