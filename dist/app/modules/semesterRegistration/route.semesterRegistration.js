"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.semesterRegistrationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validation_semesterRegistration_1 = require("./validation.semesterRegistration");
const controller_semesterRegistration_1 = require("./controller.semesterRegistration");
const router = express_1.default.Router();
// create
router.post('/create-semester-registration', (0, validateRequest_1.default)(validation_semesterRegistration_1.SemesterRegistrationValidations.createSemesterRegistrationValidationSchema), controller_semesterRegistration_1.semesterRegistrationControllers.createSemesterRegistration);
router.get('/:id', controller_semesterRegistration_1.semesterRegistrationControllers.getSingleSemesterRegistration);
router.patch('/:id', (0, validateRequest_1.default)(validation_semesterRegistration_1.SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema), controller_semesterRegistration_1.semesterRegistrationControllers.updateSemesterRegistration);
router.get('/:id', controller_semesterRegistration_1.semesterRegistrationControllers.getSingleSemesterRegistration);
router.delete('/:id', controller_semesterRegistration_1.semesterRegistrationControllers.deleteSemesterRegistration);
router.get('/', controller_semesterRegistration_1.semesterRegistrationControllers.getAllSemesterRegistration);
exports.semesterRegistrationRoutes = router;
