import { Schema, model, Document } from "mongoose";

interface IMessage {
  sender: Schema.Types.ObjectId;
  content: string;
  timestamp: Date;
}

interface IChat extends Document {
  users: Schema.Types.ObjectId[];
  messages: IMessage[];
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatSchema = new Schema<IChat>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Chat = model<IChat>("Chat", chatSchema);

export default Chat;
