const express = require('express');
const router = express.Router();
const db = require('../db'); // PostgreSQL connection

// Fetch chat history between two users
router.get('/:userId/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM chats
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY timestamp ASC`,
      [userId, otherUserId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching chat history', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Save a new message
router.post('/', async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO chats (sender_id, receiver_id, message, timestamp)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [sender_id, receiver_id, message]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving message', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
