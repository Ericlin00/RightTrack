const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,        // now 'db' from docker-compose
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});


app.get('/jobs', async (req, res) => {
  const result = await pool.query('SELECT * FROM jobs');
  res.json(result.rows);
});

app.post('/jobs', async (req, res) => {
  const { company, role, status } = req.body;
  await pool.query(
    'INSERT INTO jobs (company, role, status) VALUES ($1, $2, $3)',
    [company, role, status]
  );
  res.status(201).send('Created');
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
