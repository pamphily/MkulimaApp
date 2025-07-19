const express = require('express');
const router = express.Router();
const db = require('../db'); // PostgreSQL connection

// Fetch chat history between two users (with image support)
router.get('/history/:userId/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const result = await db.query(
      `SELECT id, sender_id, receiver_id, message AS content,
              ENCODE(image, 'base64') AS image,
              timestamp AS created_at
       FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY timestamp ASC`,
      [userId, otherUserId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Save a new message (with optional image)
router.post('/send', async (req, res) => {
  const { sender_id, receiver_id, content, image } = req.body;
  const imageBuffer = image ? Buffer.from(image, 'base64') : null;

  try {
    const result = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, message, image, timestamp)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, sender_id, receiver_id, message AS content,
                 ENCODE(image, 'base64') AS image, timestamp AS created_at`,
      [sender_id, receiver_id, content, imageBuffer]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get recent chats with last message and time
router.get('/recent/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(`
      SELECT DISTINCT ON (u.id)
        u.id, u.name, u.role, u.avatar,
        rc.last_message, rc.last_message_time
      FROM recent_chats rc
      JOIN users u ON (u.id = rc.user1_id OR u.id = rc.user2_id)
      WHERE (rc.user1_id = $1 OR rc.user2_id = $1) AND u.id != $1
      ORDER BY u.id, rc.last_message_time DESC;
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recent chats:', err);
    res.status(500).json({ error: 'Failed to fetch recent chats' });
  }
});

module.exports = router;
