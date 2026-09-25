import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  txId: { type: String, required: true, unique: true },
  enrollid: String,
  name: String,
  type: String,
  amount: Number,
  mode: String,
  date: String
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
