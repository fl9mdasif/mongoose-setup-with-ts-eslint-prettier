/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

// parser middleware
app.use(express.json());
app.use(cors());

// application routes
// /api/v1/students/create-student
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from next level dev');
});

// not found middleware with http-status
app.use(notFound);

// global err handler middleware. must declare it in the last off the file
app.use(globalErrorHandler);

export default app;
