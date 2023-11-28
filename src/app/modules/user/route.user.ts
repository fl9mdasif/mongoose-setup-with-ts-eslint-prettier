import express from 'express';
import { userController } from './controller.user';

const router = express.Router();

router.post('/create-student', userController.createStudent);

export const userRoute = router;
