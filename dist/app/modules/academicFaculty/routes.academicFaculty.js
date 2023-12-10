"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const controller_academicFaculty_1 = require("./controller.academicFaculty");
const validation_academicFaculty_1 = require("./validation.academicFaculty");
const router = express_1.default.Router();
router.post('/create-academic-faculty', (0, validateRequest_1.default)(validation_academicFaculty_1.AcademicFacultyValidation.createAcademicFacultyValidationSchema), controller_academicFaculty_1.AcademicFacultyControllers.createAcademicFaculty);
router.get('/:facultyId', controller_academicFaculty_1.AcademicFacultyControllers.getSingleAcademicFaculty);
router.patch('/:facultyId', (0, validateRequest_1.default)(validation_academicFaculty_1.AcademicFacultyValidation.updateAcademicFacultyValidationSchema), controller_academicFaculty_1.AcademicFacultyControllers.updateAcademicFaculty);
router.get('/', controller_academicFaculty_1.AcademicFacultyControllers.getAllAcademicFaculties);
exports.AcademicFacultyRoutes = router;
