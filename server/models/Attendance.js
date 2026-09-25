import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: String,
  dept: String,
  yearClass: String,
  totalStudents: Number,
  absentees: [
    {
      enrollid: String,
      name: String
    }
  ],
  presentCount: Number,
  absentCount: Number,
  markedBy: {
    name: String,
    role: String
  },
  markedAt: String,
  updatedBy: {
    name: String,
    role: String
  },
  updatedAt: String
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
