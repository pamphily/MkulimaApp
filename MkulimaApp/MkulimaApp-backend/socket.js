const users = {}; // Maps userId → socket.id
const db = require('./db'); // PostgreSQL connection

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

    // Handle sending a private message (text or image)
    socket.on('sendMessage', async ({ senderId, receiverId, message, image }) => {
      const timestamp = new Date().toISOString();
      const receiverSocketId = users[receiverId];
      const imageBuffer = image ? Buffer.from(image, 'base64') : null;

      // Emit real-time to receiver if online
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', {
          senderId,
          receiverId,
          message,
          image,
          timestamp,
        });
        console.log(`✉️ Real-time message sent from ${senderId} to ${receiverId}`);
      } else {
        console.log(`⚠️ Receiver ${receiverId} not connected`);
      }

      // Save message in messages table
      try {
        await db.query(
          `INSERT INTO messages (sender_id, receiver_id, message, image, timestamp)
           VALUES ($1, $2, $3, $4, $5)`,
          [senderId, receiverId, message, imageBuffer, timestamp]
        );
        console.log('✅ Message saved to database');
      } catch (err) {
        console.error('❌ Failed to save message:', err);
      }

      // Update or insert into recent_chats
      try {
        await db.query(`
          INSERT INTO recent_chats (user1_id, user2_id, last_message, last_message_time)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (user1_id, user2_id)
          DO UPDATE SET last_message = $3, last_message_time = $4
        `, [senderId, receiverId, message || '[Image]', timestamp]);
        console.log('🕓 Recent chat updated');
      } catch (err) {
        console.error('❌ Failed to update recent chats:', err);
      }
    });

    // Fallback public broadcast (optional)
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
