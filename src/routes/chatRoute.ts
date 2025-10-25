import express from 'express';
import { saveMessage, getChatHistory, markMessagesAsSeen } from '../controller/message';
import controller from '../controller/chatbot';

const router = express.Router();

// Define POST route for chatbot
router.post('/', controller.chatBot);

// Add chat message routes
router.post('/message', saveMessage);
router.get('/history', getChatHistory);
router.post('/seen', markMessagesAsSeen);

export default router;
