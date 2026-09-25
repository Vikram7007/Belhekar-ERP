import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  enrollid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: String,
  dob: String,
  birthplace: String,
  category: String,
  aadhar: String,
  photo: String,
  father: String,
  mother: String,
  mobile: String,
  parentmobile: String,
  address: String,
  yearAdmission: Number,
  academicYear: String,
  yearClass: String,
  dept: String,
  appid: String,
  abc: String,
  email: String,
  cap: String,
  regFee: Number,
  tuiFee: Number,
  scholarshipEligible: String,
  scholar1: String,
  scholar2: String,
  outstanding: Number,
  marks: {
    type: Map,
    of: Number
  }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
