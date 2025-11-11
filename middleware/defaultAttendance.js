import Attendance from "../models/attendanceModel.js";
import workerModel from "../models/workerModel.js";
import Worker from "../models/workerModel.js"

const defaultAttendance = async(req,resizeBy,next)=>{
    try {
         const date =new Date().toISOString().split( 'T')[0];
         const existingAttendance = await Attendance.findOne({date});

         if(!existingAttendance){
            const workers =await workerModel.find({});
            const attendance = workers.map(employee =>({date,workerId:Worker._id,status:null}));

            await Attendance.insertMany(attendance);
         }
    } catch (error) {
        res.status(500).json({sucess:false,error:error})
        
    }
};

export default defaultAttendance;