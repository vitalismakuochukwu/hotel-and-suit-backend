import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const workerSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    Position: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    position: {
      type: String,
    },
    status: {
      type: String,
    },
    country: {
      type: String,
    },
    stateOfOrigin: {
      type: String,
    },
    lgaOfOrigin: {
      type: String,
    },
    residentialAddress: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    religion: {
      type: String,
    },
    image: {
      type: String,
    },
    serialNumber: {
      type: String,
    },
    salary: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
workerSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("Password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Worker', workerSchema);
