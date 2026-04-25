import { Request, Response } from 'express';
import Message from '../models/Message';
import { users } from '../socket'; // Import users map from socket

// Helper to normalize time to 24-hour HH:mm
function to24Hour(time: string): string {
  if (/^\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/.test(time)) return time;

  const match = time.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?\s*(am|pm)?/i);
  if (match) {
    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const second = parseInt(match[3] || '0');
    const millisecond = parseInt(match[4] || '0');
    const ampm = match[5]?.toLowerCase();

    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, '0')}:` +
           `${minute.toString().padStart(2, '0')}:` +
           `${second.toString().padStart(2, '0')}.` +
           `${millisecond.toString().padStart(3, '0')}`;
  }

  const date = new Date(`1970-01-01T${time}`);
  if (!isNaN(date.getTime())) {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${h}:${m}:${s}.${ms}`;
  }

  return time;
}

// Save a chat message
export const saveMessage = async (req: Request, res: Response): Promise<void> => {
  let { senderId, recipientId, text, time } = req.body;
  if (!senderId || !recipientId || !text || !time) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  try {
    time = to24Hour(time);
    let seen = 0; // offline by default
    if (users.has(recipientId)) {
      seen = 1; // online but not seen
    }

    const newMessage = new Message({
      senderId,
      recipientId,
      text,
      time,
      seen
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

// Get chat history between two users
export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  const { userId, otherUserId } = req.query;
  if (!userId || !otherUserId) {
    res.status(400).json({ error: 'Missing required query params' });
    return;
  }
  try {
    const history = await Message.find({
      $or: [
        { senderId: userId as any, recipientId: otherUserId as any },
        { senderId: otherUserId as any, recipientId: userId as any }
      ]
    } as any).sort({ createdAt: 1 });
    
    res.json(history);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// Mark messages as seen
export const markMessagesAsSeen = async (req: Request, res: Response): Promise<void> => {
  const { senderId, recipientId } = req.body;
  if (!senderId || !recipientId) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  try {
    await Message.updateMany(
      { senderId, recipientId, seen: { $ne: 2 } },
      { $set: { seen: 2 } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking messages as seen:', err);
    res.status(500).json({ error: 'Failed to mark messages as seen' });
  }
};


