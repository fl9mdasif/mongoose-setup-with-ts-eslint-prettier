"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validation_academicSemester_1 = require("./validation.academicSemester");
const controller_academicSemester_1 = require("./controller.academicSemester");
const router = express_1.default.Router();
router.post('/create-academic-semester', (0, validateRequest_1.default)(validation_academicSemester_1.AcademicSemesterValidations.createAcademicSemesterValidationSchema), controller_academicSemester_1.AcademicSemesterControllers.createAcademicSemester);
router.get('/:semesterId', controller_academicSemester_1.AcademicSemesterControllers.getSingleAcademicSemester);
router.patch('/:semesterId', (0, validateRequest_1.default)(validation_academicSemester_1.AcademicSemesterValidations.updateAcademicSemesterValidationSchema), controller_academicSemester_1.AcademicSemesterControllers.updateAcademicSemester);
router.get('/', controller_academicSemester_1.AcademicSemesterControllers.getAllAcademicSemesters);
exports.AcademicSemesterRoutes = router;
