import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import usersRoutes from './routes/userRoute';
import chatRoute from './routes/chatRoute';
import authRoute from './routes/authRoute';
import { setupSocket } from './socket';
import { authenticateToken } from '../middleware/auth';

dotenv.config();

const app = express();
const server = http.createServer(app); // This is key!

// Attach Socket.IO to the same HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://192.168.1.23:3001', 'http://localhost:3001','https://chat-work-backend.onrender.com/'],
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

app.use('/api/users', authenticateToken,usersRoutes);
app.use('/api/chat', authenticateToken,chatRoute);
app.use('/api/auth', authRoute);
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from backend!' });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
