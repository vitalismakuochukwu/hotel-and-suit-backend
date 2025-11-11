import express from 'express'
import { addHotel,listHotel,removeHotel,singleHotel } from '../controllers/hotelController.js'
import adminAuth from '../middleware/adminAuth.js'
import upload from '../middleware/multer.js'


const hotelRouter =express.Router()
hotelRouter.post("/add", upload.any(),addHotel)
hotelRouter.get("/list", listHotel)
hotelRouter.post("/remove",  removeHotel)
hotelRouter.get("/rooms/:id", singleHotel)


export default hotelRouter
