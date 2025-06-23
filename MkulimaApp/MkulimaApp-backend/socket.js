// socket.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // Listen for a new post creation
    socket.on('newPost', (post) => {
      console.log('📨 Broadcasting new post:', post);
      io.emit('newPost', post); // Broadcast to all clients
    });

    // (Optional) Listen for replies
    socket.on('newReply', (reply) => {
      console.log('📨 Broadcasting new reply:', reply);
      io.emit('newReply', reply);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};
