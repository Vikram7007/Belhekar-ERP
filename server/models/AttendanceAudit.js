import mongoose from 'mongoose';

const attendanceAuditSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  action: String,
  by: String,
  role: String,
  timestamp: String,
  details: String
}, { timestamps: true });

const AttendanceAudit = mongoose.model('AttendanceAudit', attendanceAuditSchema);
export default AttendanceAudit;
