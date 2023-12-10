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
const router = express_1.default.Router();
router.post('/create-student', (0, validateRequest_1.default)(validation_student_1.studentValidations.createStudentValidationSchema), controller_user_1.userControllers.createStudent);
router.post('/create-faculty', (0, validateRequest_1.default)(validation_faculty_1.createFacultyValidationSchema), controller_user_1.userControllers.createFaculty);
router.post('/create-admin', (0, validateRequest_1.default)(validation_admin_1.createAdminValidationSchema), controller_user_1.userControllers.createAdmin);
exports.userRoute = router;
