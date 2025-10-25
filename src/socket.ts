import { Server, Socket } from 'socket.io';

export const users = new Map<string, string>();       // username -> socketId
const onlineUsers = new Map<string, string>(); // socketId -> username

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('register', (username: string) => {
      users.set(username, socket.id);
      onlineUsers.set(socket.id, username);

      const userList = Array.from(new Set(onlineUsers.values()));
      io.emit('user-list', userList);

      console.log(`User registered: ${username}`);
    });

    socket.on('send-private-message', ({ to, message }: { to: string; message: string }) => {
      const targetSocketId = users.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('receive-message', message); // ✅ ONLY THIS
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);

      // Clean up
      const username = onlineUsers.get(socket.id);
      if (username) {
        users.delete(username);
      }
      onlineUsers.delete(socket.id);

      const userList = Array.from(new Set(onlineUsers.values()));
      io.emit('user-list', userList);
    });
  });
};
