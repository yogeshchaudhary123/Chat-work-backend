import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  text: string;
  time: string;
  seen: number; // 0: unseen, 1: delivered (online), 2: seen
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  time: { type: String, required: true },
  seen: { type: Number, default: 0 },
}, {
  timestamps: true
});

export default mongoose.model<IMessage>('Message', MessageSchema);
