import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDB= async () =>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)//mongoose give us a return object
        console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("Mongoose connection error: ",error) //async method sends an promise that we wrap here
        process.exit(1)
    }
}
export default connectDB