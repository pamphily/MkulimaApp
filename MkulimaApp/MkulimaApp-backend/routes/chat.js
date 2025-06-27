const express = require('express');
const router = express.Router();
const db = require('../db'); // PostgreSQL connection

// Fetch chat history between two users
router.get('/history/:userId/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const result = await db.query(
      `SELECT id, sender_id, receiver_id, message AS content, timestamp AS created_at
       FROM chats
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

// Save a new message
router.post('/send', async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO chats (sender_id, receiver_id, message, timestamp)
       VALUES ($1, $2, $3, NOW()) RETURNING id, sender_id, receiver_id, message AS content, timestamp AS created_at`,
      [sender_id, receiver_id, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get recent chats with last message time
router.get('/recent/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(`
      SELECT DISTINCT ON (u.id)
        u.id, u.name, u.role, MAX(c.timestamp) AS lastMessageTime
      FROM users u
      JOIN chats c ON (u.id = c.sender_id OR u.id = c.receiver_id)
      WHERE (c.sender_id = $1 OR c.receiver_id = $1) AND u.id != $1
      GROUP BY u.id, u.name, u.role
      ORDER BY u.id, lastMessageTime DESC;
    `, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recent chats:', err);
    res.status(500).json({ error: 'Failed to fetch recent chats' });
  }
});

module.exports = router;
