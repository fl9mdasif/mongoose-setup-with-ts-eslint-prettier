import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidation } from './validation.auth';
import { AuthControllers } from './controller.auth';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/constant.user';
// import authValidation from './validation.auth'
// import auth from '../../middlewares/auth';
// import { USER_ROLE } from './../user/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(authValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const authRoutes = router;
