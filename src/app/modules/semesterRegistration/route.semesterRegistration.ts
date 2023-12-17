import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidations } from './validation.semesterRegistration';
import { semesterRegistrationControllers } from './controller.semesterRegistration';
const router = express.Router();
// create
router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/:id',
  semesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.updateSemesterRegistration,
);

router.get(
  '/:id',
  semesterRegistrationControllers.getSingleSemesterRegistration,
);

router.delete(
  '/:id',
  semesterRegistrationControllers.deleteSemesterRegistration,
);

router.get('/', semesterRegistrationControllers.getAllSemesterRegistration);

export const semesterRegistrationRoutes = router;
