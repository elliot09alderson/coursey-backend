import express from 'express'
import {contact} from '../controllers/otherController.js'
import { courseRequest, getDashboardStats } from '../controllers/otherController.js'
import { authorizedAdmin, isAuthenticated } from '../middlewares/auth.js'
const otherRoutes = express.Router()
otherRoutes.route("/contact").post(contact)
otherRoutes.route("/courserequest").post(courseRequest)
otherRoutes.route("/admin/stats").post(isAuthenticated,authorizedAdmin,getDashboardStats)

export default otherRoutes