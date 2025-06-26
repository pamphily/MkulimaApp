const users = {}; // Map userId → socket.id

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // ========== FORUM EVENTS ==========
    socket.on('newPost', (post) => {
      console.log('📨 Broadcasting new post:', post);
      io.emit('newPost', post);
    });

    socket.on('newReply', (reply) => {
      console.log('📨 Broadcasting new reply:', reply);
      io.emit('newReply', reply);
    });

    // ========== CHAT SYSTEM EVENTS ==========

    // Register a user with their ID (called after login)
    socket.on('register', (userId) => {
      users[userId] = socket.id;
      console.log(`🟢 Registered user ${userId} to socket ${socket.id}`);
    });

    // Handle sending a private message
    socket.on('sendMessage', ({ senderId, receiverId, message }) => {
      const receiverSocketId = users[receiverId];

      // Send message to the receiver if they're connected
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', {
          senderId,
          message,
          timestamp: new Date().toISOString(),
        });
        console.log(`✉️ Message from ${senderId} to ${receiverId}: ${message}`);
      } else {
        console.log(`⚠️ Receiver ${receiverId} not connected`);
      }



      const db = require('./db');
      db.query(
        'INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3)',
        [senderId, receiverId, message]
      );

    });
    // Listen for real-time chat messages
    socket.on('newMessage', (msg) => {
      console.log('💬 Broadcasting message:', msg);
      io.emit('newMessage', msg);
    });


    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
      for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          delete users[userId];
          console.log(`🗑️ Removed user ${userId} from socket map`);
          break;
        }
      }
    });
  });
};
