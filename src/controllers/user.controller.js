import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {user} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser =asyncHandler( async(req,res)=>{
    // console.log("reached:")
    // res.status(200).json({
    //     message:"ok"
    // })

    //steps for controller
    //get user detail from frontend
    //validation-not empty
    //check if user already exist : username,email
    //check for images ,check for avatar
    //upload them to cloudinary
    //create user object-create entry in db
    //remove password and refresh token key
    //check for user creation
    //return res

    const {fullname,email,username,password}=req.body

    //1st method
    // if(fullname=="")
    // {
    //     throw new apiError(400,"fullname is required")
    // }

    if([fullname,email,username,password].some((field)=>field?.trim()==="")){
        throw new apiError(400,"Allfields required")
    }

    const existingUser=await user.findOne({
        $or: [{username},{email}]//it will check for all object and or means any one of them find 
    })
    if(existingUser)
    {
        throw new apiError(409,"User already exist")
    }

    const avatarPath=req.files?.avatar[0]?.path
    if(!avatarPath){
        throw new apiEroor(400,"Avatar is required")
    }
    console.log("avatar path:",avatarPath)
    const avatar=await uploadOnCloudinary(avatarPath) 
    if(!avatar){
        throw new apiError(400,"Avatar is requied")
    }
    console.log(req.files)
    // const coverImagePath=req.files?.coverImage[0]?.path
    // if(!coverImagePath){
    //     throw apiEroor(400,"Cover Imgae is required")
    // }
    let coverImage;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0)
    {
        coverImage=await uploadOnCloudinary(coverImagePath)
    }
    // const coverImage=await uploadOnCloudinary(coverImagePath)//uploading takes time //coverImage is not required field
    // if(!coverImage){
    //     throw apiError(400,"Cover Image is requied")
    // }

    const newUser=await user.create({
        fullname,
        avatar: avatar.url,//cloudinary file return response not URL
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await user.findById(newUser._id).select(
        "-password -refreshToken" //we write here what we donot required
    )
    if(!createdUser){ 
        throw new apiError(400,"something went wrong whie registering the user")
    }

    return res.status(201).json(
        new apiResponse(200,createdUser,"User created Successfully")
    )
})

export {registerUser}