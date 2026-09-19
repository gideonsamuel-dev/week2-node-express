require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // JSON body parsing
app.use(express.static(path.join(__dirname, 'public'))); // Serve static HTML at /

// In-memory "users" store just so GET /user/:id has something to return
const users = {};
let nextId = 1;

// GET /api — plain text greeting
app.get('/api', (req, res) => {
  res.send('My Week 2 API!');
});

// POST /user — Accepts {name, email}; responds "Hello, [name]!"
app.post('/user', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Both "name" and "email" are required.' });
  }

  const id = nextId++;
  users[id] = { id, name, email };

  res.status(201).json({ message: `Hello, ${name}!`, id });
});

// GET /user/:id — "User [id] profile"
app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const user = users[id];

  if (!user) {
    return res.status(404).json({ error: `User ${id} not found.` });
  }

  res.send(`User ${id} profile: ${JSON.stringify(user)}`);
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});