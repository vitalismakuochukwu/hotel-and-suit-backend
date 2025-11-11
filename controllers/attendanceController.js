import Attendance from "../models/attendanceModel.js";
import Worker from "../models/workerModel.js";

const getAttendance =async(req,res)=>{
   try {
     const date = new Date();
     date.setHours(0, 0, 0, 0); // Set to start of day
     const dateString = date.toISOString().split('T')[0];

     // Get all workers
     const workers = await Worker.find().select('Name Email Gender Position _id');

     // Get attendance records for today
     const attendanceRecords = await Attendance.find({date: dateString});

     // Create a map of workerId to attendance records (morning and afternoon)
     const attendanceMap = {};
     attendanceRecords.forEach(record => {
       const key = record.workerId.toString();
       if (!attendanceMap[key]) {
         attendanceMap[key] = {};
       }
       attendanceMap[key][record.shift] = record;
     });

     // Combine workers with their attendance status for morning and afternoon
     const attendanceData = workers.map(worker => ({
       _id: worker._id,
       fullname: worker.Name,
       email: worker.Email,
       gender: worker.Gender,
       position: worker.Position,
       workerId: worker._id,
       morningStatus: attendanceMap[worker._id.toString()]?.morning?.status || 'Not marked',
       afternoonStatus: attendanceMap[worker._id.toString()]?.afternoon?.status || 'Not marked',
       date: dateString
     }));

     // Filter out dummy data
     const filteredData = attendanceData.filter(record =>
       !['Makuo', 'John Doe'].includes(record.fullname)
     );

     res.status(200).json({success:true,attendance: filteredData})
   } catch (error) {
    res.status (500).json({success:false, message:error.message})
   }
}

const markAttendance = async (req, res) => {
  try {
    const { workerId, status, date, shift } = req.body;
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0); // Set to start of day

    // Find existing attendance for the worker on the given date and shift
    let attendance = await Attendance.findOne({ workerId, date: attendanceDate, shift });

    if (attendance) {
      // Update existing attendance
      attendance.status = status;
      attendance.startTime = new Date();
      await attendance.save();
    } else {
      // Create new attendance record
      const worker = await Worker.findById(workerId);
      if (!worker) {
        return res.status(404).json({ success: false, message: 'Worker not found' });
      }
      attendance = new Attendance({
        workerId,
        fullname: worker.Name,
        position: worker.Position,
        shift,
        startTime: new Date(),
        location: { latitude: 0, longitude: 0 }, // Default location
        date: attendanceDate,
        status,
      });
      await attendance.save();
    }

    res.status(200).json({ success: true, message: 'Attendance marked successfully', attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {getAttendance, markAttendance};
