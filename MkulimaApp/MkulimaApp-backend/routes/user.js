const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserById } = require('../models/User');
const authenticate = require('../middleware/authenticate');
const db = require('../db'); // PostgreSQL connection

// ✅ POST /user — Register a new user
router.post('/', async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      status: 'success',
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// ✅ GET /user/profile — Get current user info (requires token)
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const { id, name, email, phone, role, created_at } = user;

    res.json({
      status: 'success',
      user: {
        id,
        name,
        email,
        phone,
        role,
        createdAt: created_at,
      },
    });
  } catch (error) {
    console.error('Error in /user/profile route:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// ✅ GET /user/:id — Get user by ID (requires token)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const requestedId = req.params.id;
    const tokenUserId = req.user.id;

    // Optional: Ensure users can only view their own profile unless they're admin
    if (requestedId !== tokenUserId) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized access' });
    }

    const user = await findUserById(requestedId);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const { id, name, email, phone, role, created_at } = user;

    res.json({
      status: 'success',
      user: {
        id,
        name,
        email,
        phone,
        role,
        createdAt: created_at,
      },
    });
  } catch (error) {
    console.error('Error in /user/:id route:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});


// ✅ GET /api/users — Get all users (used in ChatListScreen)
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


module.exports = router;
