import express from 'express';
import { userController } from './controller.user';

import { studentValidations } from '../students/validation.student';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  userController.createStudent,
);

export const userRoute = router;
