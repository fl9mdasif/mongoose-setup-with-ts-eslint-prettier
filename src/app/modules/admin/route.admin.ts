import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminControllers } from './controller.admin';
import { updateAdminValidationSchema } from './validation.admin';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/constant.user';

const router = express.Router();

router.get('/:adminId', AdminControllers.getSingleAdmin);

router.patch(
  '/:adminId',
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:adminId', AdminControllers.deleteAdmin);
router.get('/', auth(USER_ROLE.admin), AdminControllers.getAllAdmins);

export const AdminRoutes = router;
