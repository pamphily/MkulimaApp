const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserById } = require('../models/User');
const authenticate = require('../middleware/authenticate');

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

    // Optionally create a token immediately after registration
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
    console.log('Authenticated user:', req.user); // Debug log

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
    console.error('Error in /user/profile route:', error); // Debug log
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
