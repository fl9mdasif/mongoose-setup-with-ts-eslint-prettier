import express, { NextFunction, Request, Response } from 'express';

import { studentValidations } from '../students/validation.student';
import validateRequest from '../../middlewares/validateRequest';
import { createFacultyValidationSchema } from '../faculty/validation.faculty';
import { userControllers } from './controller.user';
import { createAdminValidationSchema } from '../admin/validation.admin';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './constant.user';
import { UserValidation } from './validation.user';
import { upload } from '../../utils/sendEmailToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth('admin', USER_ROLE.faculty),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createFacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-admin',
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  userControllers.createAdmin,
);

router.post(
  '/change-status/:id',
  auth('admin'),
  validateRequest(UserValidation.changeStatusValidationSchema),
  userControllers.changeStatus,
);

router.get('/me', auth('student', 'faculty', 'admin'), userControllers.getMe);

export const userRoute = router;
