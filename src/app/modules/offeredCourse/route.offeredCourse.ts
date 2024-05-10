import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseControllers } from './controller.offeredCourse';
import { offeredCourseValidations } from './validation.offeredCourse';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/constant.user';

const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  OfferedCourseControllers.getAllOfferedCourses,
);

router.get(
  '/my-offered-courses',
  auth(USER_ROLE.student),
  OfferedCourseControllers.getMyOfferedCourses,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  OfferedCourseControllers.getSingleOfferedCourses,
);

router.post(
  '/create-offered-course',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(offeredCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

// update
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OfferedCourseControllers.deleteOfferedCourseFromDB,
);

export const offeredCourseRoutes = router;
