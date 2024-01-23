import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim:true,
        index:true//to optimise searching thing 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudinary
        required:true
    },
    coverImage:{
        type:String,
    },
    watchHistory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"video"
    }],
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

userSchema.pre("save",async function(next){ //hooks of mongo
    if(this.isModified("password"))
    {
        this.password=await bcrypt.hash(this.password, 10)
    }
    next()
})//as this context is not availale in arrow function

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.campare(password,this.password)
}

userSchema.method.generateAccessToken=function(){
    return jwt.sigh({
        _id: this._id,
        email: this.email,
        fullname: this.fullname,
        username: this.username
        },
        process.env.ACCESS_TOOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.method.generateRefreshToken=function(){
    return jwt.sigh({
        _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const user = mongoose.model("user",userSchema)