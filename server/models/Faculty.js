import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: String,
  dob: String,
  category: String,
  aadhar: String,
  pan: String,
  photo: String,
  father: String,
  mother: String,
  mobile: String,
  parentmobile: String,
  address: String,
  joiningYear: Number,
  dept: String,
  designation: String,
  qualification: String,
  email: String,
  bankAcc: String,
  bankIfsc: String,
  bankBranch: String,
  salary: Number
}, { timestamps: true });

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;
