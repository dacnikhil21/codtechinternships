import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  status: { type: String, enum: ['pending', 'submitted', 'verified'], default: 'pending' },
  submissionUrl: { type: String },
  submittedAt: { type: Date },
  feedback: { type: String },
  pointsAwarded: { type: Number, default: 0 }
});

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
