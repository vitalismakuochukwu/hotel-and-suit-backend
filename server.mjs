import express from "express"
import cors from "cors"
import  "dotenv/config"
import "colors"
import connectDB from "./config/db.js"
import connectCloudinary from "./config/cloudinary.js"
import hotelRouter from "./routes/hotelRoute.js"
import reservationRouter from "./routes/reservationRoute.js"
import adminRouter from "./routes/adminRoute.js"
import workerRouter from "./routes/workerRoute.js"
import announcementRouter from "./routes/announcementRoute.js"
import attendanceRouter from './routes/attendanceRoute.js'
import path from 'path'
import fs from 'fs'



const app = express()

const port = process.env.PORT||3000
 connectDB()
connectCloudinary()
app.use(cors ())
app.use (express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use ('/api/hotel',hotelRouter)
app.use ('/api/reservation',reservationRouter)
app.use ('/api/admin',adminRouter)
app.use ('/api/worker',workerRouter)
app.use ('/api/attendance',attendanceRouter)
app.use ('/api/announcement',announcementRouter)
app.get('/',(req,res)=>{
    res.send ("API Working")
})

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
    next(err);
});

app.listen(port,()=>console.log(`\x1b[33mServer started on port:${port}\x1b[0m`))
