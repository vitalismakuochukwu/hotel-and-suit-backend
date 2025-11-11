import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    shift: {
      type: String,
      enum: ['morning', 'afternoon'],
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'sick', 'leave'],
      default: 'absent',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Attendance', attendanceSchema);
