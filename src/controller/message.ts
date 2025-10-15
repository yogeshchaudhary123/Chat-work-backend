import { Request, Response } from 'express';
import Message from '../models/messageModel';

const getMessages = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;

    const messages = await Message.find({
      users: { $all: [from, to] },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addMessage = async (req: Request, res: Response) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default { getMessages, addMessage };