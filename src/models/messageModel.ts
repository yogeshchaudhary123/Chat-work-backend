import { Schema, model, Document } from "mongoose";

interface IMessage extends Document {
  message: {
    text: string;
  };
  users: Schema.Types.ObjectId[];
  sender: Schema.Types.ObjectId;
}

const messageSchema = new Schema<IMessage>(
  {
    message: {
      text: { type: String, required: true },
    },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Message = model<IMessage>("Message", messageSchema);

export default Message;
