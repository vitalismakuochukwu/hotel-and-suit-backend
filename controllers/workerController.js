import workerModel from "../models/workerModel.js";
import attendanceModel from "../models/attendanceModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const RegisterNewWorker = async (req, res) => {
  // Normalize req.body by trimming keys and values
  const normalizedBody = {};
  for (const key in req.body) {
    const trimmedKey = key.trim();
    normalizedBody[trimmedKey] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
  }
  const { Name, Email, Gender, Position, Password, dateOfBirth, serialNumber } = normalizedBody;
  const image = req.files ? req.files[0] : null;
  let imageUrl = "";
  try {
    if (image) {
      const { v2: cloudinary } = await import('cloudinary');
      let result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
      imageUrl = result.secure_url;
    } else {
      imageUrl = "https://picsum.photos/150";
    }

    const workerExist = await workerModel.findOne({ Email });
    if (workerExist) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }
    const requiredFields = { Name, Email, Gender, Position, Password };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return res.status(400).json({ success: false, message: `${key} is required` });
      }
    }
    const createNewWorker = new workerModel({
      Name,
      Email,
      Gender,
      Position,
      Password,
      dateOfBirth,
      serialNumber,
      image: imageUrl,
    });
    const workerResult = await createNewWorker.save();
    res.status(201).json({
      success: true,
      message: "Worker registered successfully",
      worker: {
        _id: workerResult._id,
        Name: workerResult.Name,
        Email: workerResult.Email,
        Gender: workerResult.Gender,
        Position: workerResult.Position,
        dateOfBirth: workerResult.dateOfBirth,
        serialNumber: workerResult.serialNumber,
        image: workerResult.image,
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const GetAllWorkers = async (req, res) => {
  try {
    const result = await workerModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, workers: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch data" });
  }
};

const GetSingleWorker = async (req, res) => {
  const { id } = req.params;
  try {
    const worker = await workerModel.findById(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker Id not found" });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch worker" });
  }
};

const UpdateSingleWorker = async (req, res) => {
  const { id } = req.params;
  // Normalize req.body by trimming keys and values
  const normalizedBody = {};
  for (const key in req.body) {
    const trimmedKey = key.trim();
    normalizedBody[trimmedKey] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
  }
  const { Name, Email, Gender, Position, Password } = normalizedBody;
  try {
    if (!id || id === ':id') {
      return res.status(400).json({ message: "Invalid worker ID", Name, Email, Gender, Position, Password });
    }
    const worker = await workerModel.findById(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker Id not found", Name, Email, Gender, Position, Password });
    } else {
      worker.Name = Name || worker.Name;
      worker.Email = Email || worker.Email;
      worker.Gender = Gender || worker.Gender;
      worker.Position = Position || worker.Position;
      if (Password) worker.Password = Password;
    }
    await worker.save();
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: "Failed to update worker", error: error.message, Name, Email, Gender, Position, Password });
  }
};

const DeleteSingleWorker = async (req, res) => {
  const { id } = req.params;
  try {
    const worker = await workerModel.findByIdAndDelete(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker Id not found" });
    }
    res.json({ message: "Worker Id deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete worker" });
  }
};

const Login = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const checkWorker = await workerModel.findOne({ Email });
    if (!checkWorker) {
      return res.status(401).json({ message: "Invalid Email or password", Email, Password });
    }
    const validPassword = await bcrypt.compare(Password, checkWorker.Password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Email or password", Email, Password });
    }
    const token = jwt.sign({ id: checkWorker._id }, process.env.JWT_SECRET);
    res.status(200).json({
      success: true,
      token,
      _id: checkWorker._id,
      Name: checkWorker.Name,
      Email: checkWorker.Email,
      Gender: checkWorker.Gender,
      Position: checkWorker.Position,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to login", error: error.message, Email, Password });
  }
};

const GetWorkerProfile = async (req, res) => {
  const workerId = req.body.workerId; // From middleware
  try {
    const worker = await workerModel.findById(workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }
    res.json({
      success: true,
      profile: {
        email: worker.Email,
        name: worker.name || worker.Name,
        dateOfBirth: worker.dateOfBirth,
        position: worker.position || worker.Position,
        status: worker.status,
        country: worker.country,
        stateOfOrigin: worker.stateOfOrigin,
        lgaOfOrigin: worker.lgaOfOrigin,
        residentialAddress: worker.residentialAddress,
        phoneNumber: worker.phoneNumber,
        religion: worker.religion
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile", error: error.message });
  }
};

const UpdateWorkerProfile = async (req, res) => {
  const workerId = req.body.workerId; // From middleware
  const { name, dateOfBirth, position, status, country, stateOfOrigin, lgaOfOrigin, residentialAddress, phoneNumber, religion } = req.body;
  try {
    const worker = await workerModel.findById(workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }
    // Update fields only if provided
    if (name !== undefined) worker.name = name;
    if (dateOfBirth !== undefined) worker.dateOfBirth = dateOfBirth;
    if (position !== undefined) worker.position = position;
    if (status !== undefined) worker.status = status;
    if (country !== undefined) worker.country = country;
    if (stateOfOrigin !== undefined) worker.stateOfOrigin = stateOfOrigin;
    if (lgaOfOrigin !== undefined) worker.lgaOfOrigin = lgaOfOrigin;
    if (residentialAddress !== undefined) worker.residentialAddress = residentialAddress;
    if (phoneNumber !== undefined) worker.phoneNumber = phoneNumber;
    if (religion !== undefined) worker.religion = religion;
    await worker.save();
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
};


const getAttendance = async (req, res) => {
  try {
    const records = await attendanceModel.find().populate('workerId', 'Name Email Position').sort({ date: -1 });
    // Filter out records where workerId is null (deleted workers)
    const filteredRecords = records.filter(record => record.workerId !== null);
    res.status(200).json(filteredRecords);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance", error: error.message });
  }
};

const getWorkerAttendance = async (req, res) => {
  const workerId = req.body.workerId;
  try {
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const attendance = await attendanceModel.findOne({ workerId, date: today }).sort({ date: -1 });
    if (!attendance) {
      return res.status(200).json({ success: false, message: "No attendance record for today" });
    }
    res.status(200).json({
      success: true,
      attendance: {
        signedIn: !attendance.endTime,
        startTime: attendance.startTime,
        endTime: attendance.endTime,
        shift: attendance.shift,
        location: attendance.location
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch attendance", error: error.message });
  }
};





const UpdateWorkerSalary = async (req, res) => {
  const { id } = req.params;
  const { salary } = req.body;
  try {
    const worker = await workerModel.findById(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    worker.salary = salary;
    await worker.save();
    res.json({ success: true, message: "Salary updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update salary", error: error.message });
  }
};

const MarkWorkerLeave = async (req, res) => {
  const { id } = req.params;
  const { leaveStatus } = req.body; // e.g., 'on leave', 'active'
  try {
    const worker = await workerModel.findById(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    worker.status = leaveStatus;
    await worker.save();
    res.json({ success: true, message: "Leave status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update leave status", error: error.message });
  }
};

const GetWorkersCount = async (req, res) => {
  try {
    const count = await workerModel.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch worker count", error: error.message });
  }
};

export { RegisterNewWorker, GetAllWorkers, GetSingleWorker, UpdateSingleWorker, DeleteSingleWorker, Login, UpdateWorkerProfile, GetWorkerProfile, getAttendance, getWorkerAttendance, UpdateWorkerSalary, MarkWorkerLeave, GetWorkersCount };
