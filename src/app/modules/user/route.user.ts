import express from 'express';

import { studentValidations } from '../students/validation.student';
import validateRequest from '../../middlewares/validateRequest';
import { createFacultyValidationSchema } from '../faculty/validation.faculty';
import { userControllers } from './controller.user';
import { createAdminValidationSchema } from '../admin/validation.admin';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './constant.user';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  userControllers.createAdmin,
);

export const userRoute = router;
