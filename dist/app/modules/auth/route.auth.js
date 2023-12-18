"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validation_auth_1 = require("./validation.auth");
const controller_auth_1 = require("./controller.auth");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_user_1 = require("../user/constant.user");
// import authValidation from './validation.auth'
// import auth from '../../middlewares/auth';
// import { USER_ROLE } from './../user/user.constant';
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(validation_auth_1.authValidation.loginValidationSchema), controller_auth_1.AuthControllers.loginUser);
router.post('/change-password', (0, auth_1.default)(constant_user_1.USER_ROLE.admin, constant_user_1.USER_ROLE.faculty, constant_user_1.USER_ROLE.student), (0, validateRequest_1.default)(validation_auth_1.authValidation.changePasswordValidationSchema), controller_auth_1.AuthControllers.changePassword);
// router.post(
//   '/refresh-token',
//   validateRequest(AuthValidation.refreshTokenValidationSchema),
//   AuthControllers.refreshToken,
// );
exports.authRoutes = router;
