require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors());
app.use(express.json());

/* ===============================
   STATIC FILES
================================ */

// Serve frontend files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Serve independent images folder
const imagesPath = path.join(__dirname, '..', 'images');
app.use('/images', express.static(imagesPath));

/* ===============================
   API ROUTES
================================ */

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Narropil backend running 🚀' });
});

// Contact form handler (NO HTML changes needed)
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  console.log('📩 NEW CONTACT MESSAGE');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Phone:', phone || 'N/A');
  console.log('Message:', message);
  console.log('----------------------');

  res.json({
    success: true,
    message: 'Message received successfully'
  });
});

/* ===============================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});












