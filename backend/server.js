require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* STATIC FILES */
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

/* API ROUTES */
app.get('/api/test', (req, res) => {
  res.json({ message: 'Narropil backend running 🚀' });
});

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  console.log('📩 Contact:', { name, email, phone, message });
  res.json({ success: true });
});

/* FRONTEND ROUTES (NODE 24 SAFE) */

// Root route (required for Render health check)
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// SPA fallback — only for defined routes (safe way)
app.get('/about', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));

/* START SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

