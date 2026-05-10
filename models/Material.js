import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'video', 'link'], required: true },
  url: { type: String, required: true },
  course: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Material || mongoose.model('Material', MaterialSchema);
