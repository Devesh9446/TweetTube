import {Router} from 'express'
import{registerUser} from "../controllers/user.controller.js"
import{logginUser} from "../controllers/user.controller.js"
import{logOutUser} from "../controllers/user.controller.js"
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

router.router("/logginUser").post(logginUser)
router.router("/logginUser").post(logginUser)
router.router("/logOutUser").post(verifyJWT,logOutUser)

export default router