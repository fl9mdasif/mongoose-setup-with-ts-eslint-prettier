import express from 'express';
import { studentControllers } from './controller.student';

const router = express.Router();

router.post('/create-student', studentControllers.createStudent);
router.get('/', studentControllers.getAllStudents);
router.get('/:studentId', studentControllers.getSingleStudent); // use the param 'studentId' same to controller

export const studentRoute = router;
