"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_student_1 = require("./controller.student");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validation_student_1 = require("./validation.student");
const router = express_1.default.Router();
// router.post('/create-student', studentControllers.createStudent);
router.get('/:studentId', controller_student_1.studentControllers.getSingleStudent); // use the param 'studentId' same to controller
router.delete('/:studentId', controller_student_1.studentControllers.deleteStudent); // use the param 'studentId' same to controller
router.patch('/:studentId', (0, validateRequest_1.default)(validation_student_1.updateStudentValidationSchema), controller_student_1.studentControllers.updateStudent);
router.get('/', controller_student_1.studentControllers.getAllStudents);
exports.studentRoute = router;
