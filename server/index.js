const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// ✅ CORS: allow credentials (cookies) from frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// ✅ Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ Debug logging (optional)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} from ${req.headers.origin}`);
  next();
});

// ✅ PostgreSQL pool
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST, // 'db' from docker-compose
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// ✅ Auth middleware
const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  console.log('🧪 req.cookies.token:', req.cookies.token);
  console.log('🧪 req.user:', req.user);
  console.log('🔍 Checking token:', token); // <— NEW line

  if (!token) {
    console.log('🔴 No token in cookies');
    return res.sendStatus(401);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🟢 Authenticated user:', user); // <— Should appear
    req.user = user;
    next();
  } catch (err) {
    console.log('🔴 Token verification failed:', err.message);
    res.sendStatus(403);
  }
};


// ✅ POST a job (public for now; will protect later)
app.post('/jobs', authenticate, async (req, res) => {
  const { company, role, status } = req.body;
  const userId = req.user?.id;

  console.log('🔧 Creating job with:', { company, role, status, userId });

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No user ID' });
  }

  await pool.query(
    'INSERT INTO jobs (company, role, status, user_id) VALUES ($1, $2, $3, $4)',
    [company, role, status, userId]
  );

  res.status(201).send('Created');
});


// ✅ Register
app.post('/api/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashed]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// ✅ Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // change to true if you're using HTTPS
    sameSite: 'none' // 🔥 allow cross-site cookies
  });

  res.json({ message: 'Logged in' });
});

// ✅ Auth test route
app.get('/api/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.get('/', (req, res) => {
  res.send('✅ RightTrack API is running.');
});

// ✅ Start server
app.listen(3001, () => console.log('Server running on http://localhost:3001'));
