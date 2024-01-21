import dotenv from 'dotenv'
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config({
    path:'./.env'
})
connectDB().then(()=>{
    app.on("error",()=>{
        console.log("App connection failed:",error)
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`App is listning on Port: ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log("MONDODB CONNECTION FAILED",error)
})