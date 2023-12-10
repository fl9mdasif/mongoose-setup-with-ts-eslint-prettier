"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicDepartmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const valiadation_academicDepartment_1 = require("./valiadation.academicDepartment");
const controller_academicDepartment_1 = require("./controller.academicDepartment");
const router = express_1.default.Router();
router.post('/create-academic-department', (0, validateRequest_1.default)(valiadation_academicDepartment_1.AcademicDepartmentValidation.createAcademicDepartmentValidationSchema), controller_academicDepartment_1.AcademicDepartmentControllers.createAcademicDepartment);
router.get('/:departmentId', controller_academicDepartment_1.AcademicDepartmentControllers.getSingleAcademicDepartment);
router.patch('/:departmentId', (0, validateRequest_1.default)(valiadation_academicDepartment_1.AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema), controller_academicDepartment_1.AcademicDepartmentControllers.updateAcademicDepartment);
router.get('/', controller_academicDepartment_1.AcademicDepartmentControllers.getAllAcademicDepartments);
exports.AcademicDepartmentRoutes = router;
