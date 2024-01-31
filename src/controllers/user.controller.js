import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {user} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from 'jsonwebtoken'

const generateAccessTokenRefreshToken=async(userId)=>{
    try{
        console.log(userId)
        const User=await user.findById(userId)
        console.log(User)
        const accessToken=await User.generateAccessToken()
        const refreshToken=await User.generateRefreshToken()
        // User.refreshToken=refreshToken
        await User.save({validateBeforeSave:false})//as now if we save password and other also required filed so to remove validation
    
        return {accessToken,refreshToken}

    }catch(error){
        throw new apiError(400,error)
    }
}

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
        throw new apiError(400,"All fields required")
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
        throw new apiError(400,"Avatar is required")
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
        coverImage=await uploadOnCloudinary(req.files.coverImage[0].path)
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

const logInUser =asyncHandler( async(req,res)=>{
    //req body->data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie
    const {email,username,password}=req.body;
    console.log("body",req.body)
    // if(!email || !username)
    if(!(email||username))
    {
        throw new apiError(400,"email or username required")
    }
    const User=await user.findOne({
        $or:[{email},{username}]
    })
    if(!User)
    {
        throw new apiError(404,"Invalid Email Id or Password")
    }
    const isPasswordCorrect=await User.isPasswordCorrect(password)
    if(!isPasswordCorrect)
    {
        throw new apiError(401,"Invalid User Credentials")
    }

    const{accessToken,refreshToken}=await generateAccessTokenRefreshToken(User._id)

    const loggedInUser=await user.findById(User._id).select("-password -refreshToken")

    const options={       //now cookie can be modified by server only not by frontend
        htttpOnly :true,
        secure:true
    }
    return res.status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(//if it is an some application not web one then tokens store in json format
        new apiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User LoggedIn Successfully"
        )
    )
})

const logOutUser=asyncHandler(async(req,res)=>{
    user.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true     //now sending res it did not show refreshToken
        }
    )
    const options={       //now cookie can be modified by server only not by frontend
        htttpOnly :true,
        secure:true
    }
    return res.status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(new apiResponse(200,{},"User LogOut Successfully"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incommingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

    if(incommingRefreshToken){
        throw new apiError(401,"Unauthorized request")
    }

    try{
        const decodedToken=jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const User=user.findById(decodedToken?._id)
    
        if(!User)
        {
            throw new apiError(401,"Invalid refresh Token")
        }
    
        if(incommingRefreshToken!=User.refreshToken){
            throw new apiError(401,"Refresh Token expired")   
        }
    
        const{accessToken,newrefreshToken}=await generateAccessTokenRefreshToken(decodedToken?._id)
    
        const options={      
            secure:true
        }
    
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(new apiResponse(
            200,
            {accessToken,refreshToken:newrefreshToken},
    
        ))
    }catch(error){
        throw new apiError(401,error?.message||"Invalid Refresh Token")
    }

})

export {
    registerUser,
    logInUser,
    logOutUser,
    refreshAccessToken
}