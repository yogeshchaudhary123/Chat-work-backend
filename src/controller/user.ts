import { Request, Response } from 'express';
import User from '../models/userModel';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "name",
      "avatarImage",
      "_id",
    ]);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const setAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    res.json({
      isSet: userData?.isAvatarImageSet,
      image: userData?.avatarImage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select([
      "email",
      "name",
      "avatarImage",
      "_id",
    ]);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default { getAllUsers, setAvatar, getUserById };