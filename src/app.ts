import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

// parser middleware
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from next level dev');
});

export default app;
