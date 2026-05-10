import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  importance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  author: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
