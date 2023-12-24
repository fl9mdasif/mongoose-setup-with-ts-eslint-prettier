"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const validation_student_1 = require("../students/validation.student");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validation_faculty_1 = require("../faculty/validation.faculty");
const controller_user_1 = require("./controller.user");
const validation_admin_1 = require("../admin/validation.admin");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_user_1 = require("./constant.user");
const validation_user_1 = require("./validation.user");
const sendEmailToCloudinary_1 = require("../../utils/sendEmailToCloudinary");
const router = express_1.default.Router();
router.post('/create-student', (0, auth_1.default)('admin', constant_user_1.USER_ROLE.faculty), sendEmailToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(validation_student_1.studentValidations.createStudentValidationSchema), controller_user_1.userControllers.createStudent);
router.post('/create-faculty', (0, auth_1.default)('admin'), sendEmailToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(validation_faculty_1.createFacultyValidationSchema), controller_user_1.userControllers.createFaculty);
router.post('/create-admin', (0, auth_1.default)('admin'), sendEmailToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(validation_admin_1.createAdminValidationSchema), controller_user_1.userControllers.createAdmin);
router.post('/change-status/:id', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(validation_user_1.UserValidation.changeStatusValidationSchema), controller_user_1.userControllers.changeStatus);
router.get('/me', (0, auth_1.default)('student', 'faculty', 'admin'), controller_user_1.userControllers.getMe);
exports.userRoute = router;
