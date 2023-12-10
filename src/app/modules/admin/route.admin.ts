import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminControllers } from './controller.admin';
import { updateAdminValidationSchema } from './validation.admin';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);

router.get('/:adminId', AdminControllers.getSingleAdmin);

router.patch(
  '/:adminId',
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:adminId', AdminControllers.deleteAdmin);

export const AdminRoutes = router;
