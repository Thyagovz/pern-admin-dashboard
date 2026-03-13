import express from 'express';
import 'dotenv/config';
import { index, pool } from './db/index.js';
import { demoUsers } from './db/schema/index.js';

const app = express();
const port = 8000;

// Use JSON middleware
app.use(express.json());

// Root GET route
app.get('/', (req, res) => {
  res.send('Welcome to the Classroom API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function main() {
  // This can be kept as a DB connection check or moved to an endpoint
  try {
    console.log('Checking database connection...');
    // We can just select something to test connection
    const result = await index.select().from(demoUsers).limit(1);
    console.log('✅ Database connection successful.');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    // Note: for a long-running Express server with neon-http, 
    // we don't necessarily want to close the connection immediately.
    // If using pool (WebSocket/pg), we'd close it on process termination.
  }
}

main();
