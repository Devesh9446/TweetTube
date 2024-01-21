import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))//we are able to define origin so that a particular host is use to talk withour URL not URL 


//app.use id a middle ware always call when some req come and add soem data to req.body accordig to the condition applied and similary multer is a middleware that gives rq.files accces or add items in it
app.use(express.json({limit:"16kb"}))//data from form
app.use(express.urlencoded({extended: true,limit:"16kb"}))//data from URL
app.use(express.static("public"))//to store some assests in public directory in our server
app.use(cookieParser())//cookie-parser is used to set the cookie and access the cookie from our server

import userRoutes from './routes/user.routes.js'

app.use("/api/v1/users",userRoutes)//as the user hit it gives control to userRoutes
//final URL: http://localhost:8000/api/v1/users/register

export {app}