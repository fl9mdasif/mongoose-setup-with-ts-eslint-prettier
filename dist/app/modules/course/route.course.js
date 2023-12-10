"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validation_course_1 = require("./validation.course");
const controller_course_1 = require("./controller.course");
const router = express_1.default.Router();
router.post('/create-course', (0, validateRequest_1.default)(validation_course_1.CourseValidations.createCourseValidationSchema), controller_course_1.courseControllers.createCourse);
router.get('/:id', controller_course_1.courseControllers.getSingleCourse);
router.patch('/:id', (0, validateRequest_1.default)(validation_course_1.CourseValidations.updateCourseValidationSchema), controller_course_1.courseControllers.updateCourse);
router.delete('/:id', controller_course_1.courseControllers.deleteCourse);
router.put('/:courseId/assign-faculties', (0, validateRequest_1.default)(validation_course_1.CourseValidations.facultiesWithCourseValidationSchema), controller_course_1.courseControllers.assignFacultiesWithCourse);
router.delete('/:courseId/remove-faculties', (0, validateRequest_1.default)(validation_course_1.CourseValidations.facultiesWithCourseValidationSchema), controller_course_1.courseControllers.removeFacultiesFromCourse);
router.get('/', controller_course_1.courseControllers.getAllCourses);
exports.CourseRoutes = router;
