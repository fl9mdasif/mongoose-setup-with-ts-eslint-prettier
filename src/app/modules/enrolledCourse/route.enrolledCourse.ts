import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseValidations } from './validation.enrolledCourse';
import { enrolledCourseController } from './controller.enrolledCourse';
import { USER_ROLE } from '../user/constant.user';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  enrolledCourseController.createEnrolledCourse,
);

router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
  ),
  enrolledCourseController.updateEnrolledCourseMarks,
);

router.get(
  '/my-enrolled-courses',
  auth(USER_ROLE.student),
  enrolledCourseController.getMyEnrolledCourses,
);

export const EnrolledCourseRoutes = router;
