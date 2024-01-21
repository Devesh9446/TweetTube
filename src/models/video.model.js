import mongoose from 'mongoose'
import mongooseAggregatePaginateV2 from 'mongoose-aggregate-paginate-v2'


const videoSchema= new mongoose.Schema({
        videoFile:{
            type:String,//cloudinary
            required:true,
        },
        thumbnail:{
            type:String,
            required:true,
        },
        description:{
            type:String, 
            required:true
        },
        duration:{
            type:Number,//cloudinary
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
},{timestamps:true})

videoSchema

export const video = mongoose.model("video",videoSchema)