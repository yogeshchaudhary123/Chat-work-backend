import { Request, Response } from 'express';
import header from '../connection/apiHeader';
import { users } from '../socket'; // Import users map from socket

// Helper to normalize time to 24-hour HH:mm
function to24Hour(time: string): string {
  // If already HH:mm:ss or HH:mm:ss.SSS, return as is
  if (/^\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?$/.test(time)) return time;

  // Try to parse formats like "05:27 pm" or "5:27:30.123 pm"
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

  // fallback: use Date parser
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
    // Normalize time to 24-hour HH:mm
    time = to24Hour(time);
    // Check if recipient is online
    let seen = 0; // offline by default
    if (users.has(recipientId)) {
      seen = 1; // online but not seen
    }
    const sql = `INSERT INTO messages (sender_id, recipient_id, text, time, seen) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await header.query(sql, [senderId, recipientId, text, time, seen]);
    res.status(201).json(result.rows[0]);
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
    const sql = `SELECT * FROM messages WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1) ORDER BY time ASC`;
    const result = await header.query(sql, [userId, otherUserId]);
    res.json(result.rows);
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
    // Set seen=2 for all unseen messages
    const sql = `UPDATE messages SET seen = 2 WHERE sender_id = $1 AND recipient_id = $2 AND seen <> 2`;
    await header.query(sql, [senderId, recipientId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking messages as seen:', err);
    res.status(500).json({ error: 'Failed to mark messages as seen' });
  }
};


