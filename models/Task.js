import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  domain: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  batch: { type: Number, default: 1 },
  points: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
