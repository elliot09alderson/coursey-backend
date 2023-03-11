import express, { Router } from 'express'
import { addToPlaylist, changePassword, deleteUser, forgetPassword, getAllUsers, getMyProfile, login, logout, register, removeFromPlaylist, resetPassword, updateProfile, updateProfilePicture, updateUserRole } from '../controllers/UserController.js'
import { authorizedAdmin, isAuthenticated } from '../middlewares/auth.js';
import singleUpload from '../middlewares/multer.js';
const userRouter = express.Router()
//Register a new User
userRouter.route('/register').post( singleUpload,register);
//login
userRouter.route('/login').post(login);
//log out
userRouter.route('/logout').get(logout);
//get my profile
userRouter.route('/me').get(isAuthenticated, getMyProfile);
//change password
userRouter.route('/changepassword').put(isAuthenticated, changePassword);
//update Profile
userRouter.route('/updateprofile').put(isAuthenticated, updateProfile);
//update Profile picture
userRouter.route('/updateprofilepicture').put(isAuthenticated,singleUpload, updateProfilePicture);
//forget password
userRouter.route('/forgetpassword').post( forgetPassword);
//reset password
userRouter.route('/resetpassword/:token').put(resetPassword);

//add to playlist 
userRouter.route('/addtoplaylist').post(isAuthenticated,addToPlaylist)
//remove from plpaylist
userRouter.route('/removeplaylist').delete(isAuthenticated,removeFromPlaylist)


//Admin Functions
userRouter.route("/admin/users").get(isAuthenticated,authorizedAdmin,getAllUsers)
userRouter.route("/admin/user/:id").put(isAuthenticated,authorizedAdmin,updateUserRole).delete(isAuthenticated,authorizedAdmin,deleteUser)

export default userRouter   