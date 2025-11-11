import reservationModel from "../models/reservationModel.js";

const createReservation =async (req,res) =>{
try {
    // Normalize keys by trimming whitespace
    const normalizedBody = {};
    for (const key in req.body) {
        normalizedBody[key.trim()] = req.body[key];
    }
    
    const{name,email,phone,checkin,checkout,guests,roomName,roomId} = normalizedBody
    const requiredFields = {name,email,phone,checkin,checkout,guests,roomName,roomId}
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            return res.json({message:`${key} is required`})
        }
    }
    
    const newReservation = new reservationModel({name,email,phone,checkin,checkout,guests,roomName,roomId})
    await newReservation.save()
    res.json({message:"Reservation created successfully",reservation:newReservation})
    
} catch (error) {
    console.log(error);
    res.json({message:"Internal server error"})
    
}
}

const getAllReservation =async (req,res) =>{
    try {
        const reservations =await reservationModel.find()
        res.json(reservations)
        
    } catch (error) {
        console.log(error);
        res.json({message:"Internal server error"})
        
    }
}

const deleteReservation =async (req,res) =>{
    try {
        const {id} =req.params
        await reservationModel.findByIdAndDelete(id)
        res.json({success:true, message:"Reservation deleted successfully"})

    } catch (error) {
        console.log (error);
        res.json({success:false, message:"Error deleting reservation"})
    }
}

export {createReservation,getAllReservation,deleteReservation}