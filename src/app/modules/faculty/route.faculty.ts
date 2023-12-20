import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyControllers } from './controller.faculty';
import { updateFacultyValidationSchema } from './validation.faculty';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/constant.user';

const router = express.Router();

router.get('/:id', FacultyControllers.getSingleFaculty);

router.patch(
  '/:id',
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete('/:id', FacultyControllers.deleteFaculty);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.getAllFaculties,
);

export const FacultyRoutes = router;
