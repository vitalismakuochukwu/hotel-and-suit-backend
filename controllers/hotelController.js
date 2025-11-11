import mongoose from "mongoose";
import hotelModel from "../models/hotelModel.js";
import {v2 as cloudinary} from "cloudinary";


const addHotel =async (req, res) =>{
try {
     const {name,price,description} =req.body;
     const image=req.files ? req.files[0] : null;
     let imageUrl=""
     if (image) {
          let result =await cloudinary.uploader.upload(image.path,{resource_type:'image'})
          imageUrl =result.secure_url
     } else {
          imageUrl="https://via.placeholder.com/150"
     }
     const hotelData={
          name,
          description,
          price: Number(price),
          image:imageUrl,
          date:Date.now()
     }
     const hotel =new hotelModel(hotelData)
     await hotel.save()
     res.json ({success:true,message:"Hotel room added successfully"})
} catch (error) {
     console.log (error)
     res.json({success:false,message:'Error adding hotel room '})
     
}
}
const listHotel =async (req, res) =>{
     try {
          const hotels = await hotelModel.find({});
          res.json({success:true, hotels})
     } catch (error) {
          console.log(error)
          res.json({success:false, message: 'Error listing hotel list'})
     }
}
const removeHotel =async (req, res) =>{
     try {
          await hotelModel.findByIdAndDelete(req.body._id)
          res.json({success:true,message:"Hotel room removed successfully"})

          
     } catch (error) {
          console.log(error);
          res.json({success:false,message:"Error delecting hotel room"})
          
     }
}
const singleHotel =async (req, res) =>{
     try {
          const hotel =await hotelModel.findById(req.params.id)
          if(!hotel) return res.json({message:"Room not found"})
               res.json({hotel})
               
          
     } catch (error) {
      console.log(error);
     res.json({success:false,message:"Error fetching specific hotel room"})
           
     }
}

export {addHotel, listHotel ,removeHotel,singleHotel}