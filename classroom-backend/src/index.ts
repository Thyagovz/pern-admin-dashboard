import express from 'express';
import 'dotenv/config';
import { demoUsers } from './db/schema/index.js';
import subjectsRouter from "./routes/subjects.js";
import {db} from "./db/index.js";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors({
  origin: process.env.FRONTEND_URl,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

app.use(express.json());

app.use('/api/subjects', subjectsRouter)

app.get('/', (req, res) => {
  res.send('Welcome to the Classroom API!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function main() {
  try {
    console.log('Checking database connection...');
    const result = await db.select().from(demoUsers).limit(1);
    console.log('✅ Database connection successful.');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
  }
}

main();
