const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const pool = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// In-memory OTP store
const otpStore = new Map();

// ========== SEND OTP ==========
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes

  otpStore.set(email, { otp, expiresAt });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mkulimaapplication@gmail.com',
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'mkulimaapplication@gmail.com',
    to: email,
    subject: 'Your Mkulima OTP Code',
    text: `Hello,\n\nYour OTP code is: ${otp}\nIt will expire in 5 minutes.\n\nThanks,\nMkulima's Table Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// ========== VERIFY OTP ==========
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({ message: 'No OTP found for this email' });
  }

  const { otp: validOtp, expiresAt } = record;

  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }

  if (otp !== validOtp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  otpStore.delete(email);
  return res.json({ success: true, message: 'OTP verified successfully' });
});

// ========== REGISTER ==========
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into DB
    const newUserResult = await pool.query(
      `INSERT INTO users (name, email, phone, password, role, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, name, email, phone, role, created_at`,
      [name, email, phone, hashedPassword, role]
    );

    const newUser = newUserResult.rows[0];

    // Create JWT token
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ========== LOGIN ==========
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT id, name, email, phone, role, password, created_at FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Remove password before sending
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
