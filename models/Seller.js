import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  filename: String,
  path: String,
  originalName: String
}, { _id: false });

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: { type: String, required: true },
  documents: [documentSchema],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Seller', sellerSchema);