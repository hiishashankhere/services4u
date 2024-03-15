import express from 'express'
import { deleteUser, forgotPassword, getAllUser, getSingleUser, getUserDetails, login, logout, register, resetPassword, updatePassword, updateProfile, updateRole } from '../controllers/user.js'
import {adminSide, isAuthenticated} from '../middlewares/auth.js'
const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/logout",logout)
//get userdetails
router.get("/me",isAuthenticated,getUserDetails)

//update password & user profile
router.put("/update/password",isAuthenticated,updatePassword)
router.put("/update/me",isAuthenticated,updateProfile)

//forget & reset password
router.post("/password/forgot",forgotPassword)
router.put("/password/reset/:token",resetPassword)

//admin routes
router.get("/admin/users",isAuthenticated,adminSide,getAllUser)
router.get("/admin/user/:id",isAuthenticated,adminSide,getSingleUser)
router.put("/admin/user/:id",isAuthenticated,adminSide,updateRole)
router.delete("/admin/user/:id",isAuthenticated,adminSide,deleteUser)

export default router