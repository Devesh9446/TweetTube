import {Router} from 'express'
import{registerUser} from "../controllers/user.controller.js"
import{logInUser} from "../controllers/user.controller.js"
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

router.route("/logInUser").post(logInUser)
router.route("/logOutUser").post(verifyJWT,logOutUser)

export default router