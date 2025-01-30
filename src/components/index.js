// server/index.ts
import express from 'express';
import cors from 'cors';
import { summarizeNotes } from './services/boltai';
import { exportPDF, exportWord } from './routes/export';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    const summary = await summarizeNotes(text);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Summarization failed' });
  }
});

app.post('/api/export-pdf', exportPDF);
app.post('/api/export-word', exportWord);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});