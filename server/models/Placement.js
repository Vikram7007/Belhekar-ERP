import mongoose from 'mongoose';

const placementSchema = new mongoose.Schema({
  name: String,
  enrollid: { type: String, required: true },
  dept: String,
  company: String,
  package: Number,
  year: String
}, { timestamps: true });

const Placement = mongoose.model('Placement', placementSchema);
export default Placement;
