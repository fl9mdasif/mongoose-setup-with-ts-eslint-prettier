"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const controller_faculty_1 = require("./controller.faculty");
const validation_faculty_1 = require("./validation.faculty");
const router = express_1.default.Router();
router.get('/:id', controller_faculty_1.FacultyControllers.getSingleFaculty);
router.patch('/:id', (0, validateRequest_1.default)(validation_faculty_1.updateFacultyValidationSchema), controller_faculty_1.FacultyControllers.updateFaculty);
router.delete('/:id', controller_faculty_1.FacultyControllers.deleteFaculty);
router.get('/', controller_faculty_1.FacultyControllers.getAllFaculties);
exports.FacultyRoutes = router;
