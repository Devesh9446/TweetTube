import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from '../utils/apiError.js'
import jwt from 'jsonwebtoken'
import {user} from '../models/user.model.js'

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try{
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        if(!token){
            throw new apiError(401,"Unothorized Request")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken)
        {
            throw new apiError(401,"Unothorized Request")
        }
        const User=await user.findById(decodedToken._id).select("-password -refreshToken")
        if(!User)
        {
            throw new apiError(401,"Invalid Access Token")
        }
        req.user=User;
        next();
    }catch(error){
        throw new apiError(401,error?.message||"invalid access token")
    }
})