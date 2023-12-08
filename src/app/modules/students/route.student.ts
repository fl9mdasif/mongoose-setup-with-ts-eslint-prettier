import express from 'express';
import { studentControllers } from './controller.student';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './validation.student';

const router = express.Router();

// router.post('/create-student', studentControllers.createStudent);

router.get('/:studentId', studentControllers.getSingleStudent); // use the param 'studentId' same to controller

router.delete('/:studentId', studentControllers.deleteStudent); // use the param 'studentId' same to controller

router.patch(
  '/:studentId',
  validateRequest(updateStudentValidationSchema),
  studentControllers.updateStudent,
);

router.get('/', studentControllers.getAllStudents);
export const studentRoute = router;
