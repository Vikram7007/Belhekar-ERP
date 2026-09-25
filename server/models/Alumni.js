import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema({
  name: String,
  enrollid: { type: String, required: true },
  year: String,
  dept: String
}, { timestamps: true });

const Alumni = mongoose.model('Alumni', alumniSchema);
export default Alumni;
