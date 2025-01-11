import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { POST as remixHandler } from './src/server/api/remix';

// Load environment variables
config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// API routes
app.post('/api/remix', async (req, res) => {
  try {
    console.log('Received remix request:', { text: req.body.text?.slice(0, 50) + '...' });
    
    const response = await remixHandler(new Request('http://localhost:3000/api/remix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    }));

    const data = await response.json();
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('Error response:', data);
    }
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Environment check:');
  console.log('- API Key present:', !!process.env.OPENAI_API_KEY);
  console.log('- API Key length:', process.env.OPENAI_API_KEY?.length || 0);
}); 