import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import usersRoutes from './routes/userRoute';
import chatRoute from './routes/chatRoute';
import authRoute from './routes/authRoute';
import { setupSocket } from './socket';
import { authenticateToken } from './middleware/auth';
import mongoose from 'mongoose';
import config from './config/config';

dotenv.config();

// Connect to MongoDB
const uri = config.mongo.uri;
console.log(`🔌 Attempting to connect to: ${uri.substring(0, 15)}...`);

if (!uri || uri.includes('localhost') && process.env.NODE_ENV === 'production') {
  console.error('❌ Critical Error: MONGODB_URI is missing or invalid for production.');
}

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.message.includes('ENOTFOUND')) {
      console.error('👉 Hint: This is a DNS error. Check if your MONGODB_URI hostname is correct and IP whitelisting is enabled.');
    }
    console.error('Connection URI used (masked):', uri.replace(/\/\/.*:.*@/, '//<HIDDEN_AUTH>@'));
  });

const app = express();
const server = http.createServer(app); // This is key!

// Attach Socket.IO to the same HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://192.168.1.23:3001', 'http://localhost:3001', 'https://chat-work-backend.onrender.com/'],
    methods: ['GET', 'POST'],
  },
});

setupSocket(io); // Socket handler function

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Chat Work Backend API' });
});

app.use('/api/users', authenticateToken, usersRoutes);
app.use('/api/chat', authenticateToken, chatRoute);
app.use('/api/auth', authRoute);
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from backend!' });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
