const users = {}; // Maps userId → socket.id
const db = require('./db'); // Ensure your PostgreSQL db connection is set up here

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // ======== FORUM EVENTS ========
    socket.on('newPost', (post) => {
      console.log('📨 Broadcasting new post:', post);
      io.emit('newPost', post);
    });

    socket.on('newReply', (reply) => {
      console.log('📨 Broadcasting new reply:', reply);
      io.emit('newReply', reply);
    });

    // ======== CHAT EVENTS ========

    // Register userId to socket.id
    socket.on('register', (userId) => {
      users[userId] = socket.id;
      console.log(`🟢 User ${userId} registered on socket ${socket.id}`);
    });

    // Handle sending a private message
    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
      const receiverSocketId = users[receiverId];

      // Emit message in real-time to receiver if online
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', {
          senderId,
          receiverId,
          message,
          timestamp: new Date().toISOString(),
        });
        console.log(`✉️ Real-time message sent from ${senderId} to ${receiverId}`);
      } else {
        console.log(`⚠️ Receiver ${receiverId} not connected`);
      }

      // Save message in database
      try {
        await db.query(
          'INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3)',
          [senderId, receiverId, message]
        );
        console.log('✅ Message saved to database');
      } catch (err) {
        console.error('❌ Failed to save message:', err);
      }
    });

    // Fallback for public broadcasting (optional)
    socket.on('newMessage', (msg) => {
      console.log('📡 Broadcasting public message:', msg);
      io.emit('newMessage', msg);
    });

    // Disconnect cleanup
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
      for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          delete users[userId];
          console.log(`🗑️ Cleaned up user ${userId} from socket map`);
          break;
        }
      }
    });
  });
};
