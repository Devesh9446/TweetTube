import mongoose from "mongoose"

const subscription_schema=new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true})

export const subscription = mongoose.model("subscription",subscription_schema)