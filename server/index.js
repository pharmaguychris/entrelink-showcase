import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database(join(__dirname, 'resumes.db'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.post('/api/resumes', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'No resume data provided' });
    }

    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO resumes (id, data) VALUES (?, ?)');
    stmt.run(id, JSON.stringify(data));

    res.status(201).json({ id });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

app.get('/api/resumes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM resumes WHERE id = ?');
    const result = stmt.get(id);

    if (!result) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({
      id: result.id,
      data: JSON.parse(result.data),
      createdAt: result.created_at
    });
  } catch (error) {
    console.error('Error retrieving resume:', error);
    res.status(500).json({ error: 'Failed to retrieve resume' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});