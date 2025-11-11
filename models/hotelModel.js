import mongoose from "mongoose";

const hotelSchema= new mongoose.Schema({
    name:{type:String,required:true},
        price:{type:Number,required:true},
            description:{type:String,required:false},
                image:{type:String,required:true},
                    date:{type:Number,required:true},

})

const hotelModel =mongoose.models.hotels||mongoose.model('hotels',hotelSchema);


export default hotelModel