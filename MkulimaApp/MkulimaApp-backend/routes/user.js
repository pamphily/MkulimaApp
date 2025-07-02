const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db'); // PostgreSQL connection
const authenticate = require('../middleware/authenticate');
const { sendOtpEmail } = require('../controllers/sendEmail');

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /user — Register a new user with OTP email
router.post('/', async (req, res) => {
  const { name, email, phone, role } = req.body;
  const defaultPassword = '123456';

  try {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);
    const otp = generateOTP();

    const result = await db.query(
      `INSERT INTO users (name, email, phone, password, role, otp, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, false)
       RETURNING id, name, email, phone, role, created_at`,
      [name, email, phone, hashedPassword, role, otp]
    );
    const newUser = result.rows[0];

    await sendOtpEmail(email, otp);

    res.json({
      status: 'success',
      message: 'OTP sent to email. Please verify your account.',
      userId: newUser.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// POST /user/verify — Verify OTP
router.post('/verify', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await db.query(
      `SELECT * FROM users WHERE email = $1 AND otp = $2`,
      [email, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid OTP' });
    }

    await db.query(
      `UPDATE users SET is_verified = true, otp = NULL WHERE email = $1`,
      [email]
    );

    res.json({ status: 'success', message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// POST /user/resend-otp — Resend OTP to email
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    if (user.is_verified) {
      return res.status(400).json({ status: 'error', message: 'User already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    await db.query('UPDATE users SET otp = $1 WHERE email = $2', [otp, email]);

    await sendOtpEmail(email, otp);

    res.json({ status: 'success', message: 'OTP resent to email.' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// GET /user/profile — Get current user info (with avatar)
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT id, name, email, phone, role, created_at, encode(avatar, \'base64\') AS avatar FROM users WHERE id = $1',
      [userId]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const { id, name, email, phone, role, created_at, avatar } = user;

    res.json({
      status: 'success',
      user: {
        id,
        name,
        email,
        phone,
        role,
        avatar,
        createdAt: created_at,
      },
    });
  } catch (error) {
    console.error('Error in /user/profile route:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// GET /user/:id — Get user by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const requestedId = parseInt(req.params.id, 10);
    const tokenUserId = req.user.id;

    if (requestedId !== tokenUserId) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized access' });
    }

    const result = await db.query(
      'SELECT id, name, email, phone, role, created_at, encode(avatar, \'base64\') AS avatar FROM users WHERE id = $1',
      [requestedId]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const { id, name, email, phone, role, created_at, avatar } = user;

    res.json({
      status: 'success',
      user: {
        id,
        name,
        email,
        phone,
        role,
        avatar,
        createdAt: created_at,
      },
    });
  } catch (error) {
    console.error('Error in /user/:id route:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// GET /user/ — Get all users
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// DELETE /user/:id — Delete user by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ status: 'success', message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// PATCH /user/:id — Update name, phone, password, or avatar
router.patch('/:id', authenticate, async (req, res) => {
  const userId = parseInt(req.params.id);
  const tokenUserId = req.user.id;

  if (userId !== tokenUserId) {
    return res.status(403).json({ status: 'error', message: 'Unauthorized' });
  }

  const { name, phone, currentPassword, newPassword, avatar } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const updates = [];
    const values = [];
    let index = 1;

    if (name) {
      updates.push(`name = $${index++}`);
      values.push(name);
    }

    if (phone) {
      updates.push(`phone = $${index++}`);
      values.push(phone);
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ status: 'error', message: 'Current password is required to change password' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Incorrect current password' });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      updates.push(`password = $${index++}`);
      values.push(hashed);
    }

    if (avatar) {
      const avatarBuffer = Buffer.from(avatar, 'base64');
      updates.push(`avatar = $${index++}`);
      values.push(avatarBuffer);
    }

    if (updates.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No fields to update' });
    }

    values.push(userId);
    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = $${index} RETURNING id, name, email, phone, role, created_at`;

    const result = await db.query(updateQuery, values);
    const updatedUser = result.rows[0];

    res.json({
      status: 'success',
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
