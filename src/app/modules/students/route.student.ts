import express from 'express';
import { studentControllers } from './controller.student';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './validation.student';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/constant.user';

const router = express.Router();

router.get(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),

  studentControllers.getSingleStudent,
); // use the param 'studentId' same to controller

router.delete(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),

  studentControllers.deleteStudent,
); // use the param 'studentId' same to controller

router.patch(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateStudentValidationSchema),
  studentControllers.updateStudent,
);

router.get(
  '/',
  auth('faculty', 'admin', USER_ROLE.superAdmin),
  studentControllers.getAllStudents,
);
export const studentRoute = router;
