import {Router} from 'express'
import{getCurrentUser, getUserChannelProfile, getWatchHistory, registerUser, updatAccountDetails, updateCoverImage, updateUserAvatar} from "../controllers/user.controller.js"
import{logInUser} from "../controllers/user.controller.js"
import{logOutUser} from "../controllers/user.controller.js"
import{refreshAccessToken} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router =Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ])
,registerUser)//as /user call  it gives control to register and register call controller  registerUser

router.route("/logInUser").post(logInUser)
router.route("/logOutUser").post(verifyJWT,logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJwt,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updatAccountDetails)
router.route("/avatar").patch(verifyJWT,upoad.single("avatar"),updateUserAvatar)
router.route("/coverImage"),patch(verifyJWT,ipload.single("/coverImage"),updateCoverImage)
router.route("/c/:/username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)

export default router