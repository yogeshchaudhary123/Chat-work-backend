import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  isAvatarImageSet: boolean;
  avatarImage: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    isAvatarImageSet: { type: Boolean, default: false },
    avatarImage: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
