"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validation_enrolledCourse_1 = require("./validation.enrolledCourse");
const controller_enrolledCourse_1 = require("./controller.enrolledCourse");
const router = express_1.default.Router();
router.post('/create-enrolled-course', (0, auth_1.default)('student'), (0, validateRequest_1.default)(validation_enrolledCourse_1.EnrolledCourseValidations.createEnrolledCourseValidationZodSchema), controller_enrolledCourse_1.enrolledCourseController.createEnrolledCourse);
router.patch('/update-enrolled-course-marks', (0, auth_1.default)('faculty'), (0, validateRequest_1.default)(validation_enrolledCourse_1.EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema), controller_enrolledCourse_1.enrolledCourseController.updateEnrolledCourseMarks);
exports.EnrolledCourseRoutes = router;
