"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offeredCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const controller_offeredCourse_1 = require("./controller.offeredCourse");
const validation_offeredCourse_1 = require("./validation.offeredCourse");
const router = express_1.default.Router();
router.get('/', controller_offeredCourse_1.OfferedCourseControllers.getAllOfferedCourses);
router.get('/:id', controller_offeredCourse_1.OfferedCourseControllers.getSingleOfferedCourses);
router.post('/create-offered-course', (0, validateRequest_1.default)(validation_offeredCourse_1.offeredCourseValidations.createOfferedCourseValidationSchema), controller_offeredCourse_1.OfferedCourseControllers.createOfferedCourse);
// update
router.patch('/:id', (0, validateRequest_1.default)(validation_offeredCourse_1.offeredCourseValidations.updateOfferedCourseValidationSchema), controller_offeredCourse_1.OfferedCourseControllers.updateOfferedCourse);
router.delete('/:id', controller_offeredCourse_1.OfferedCourseControllers.deleteOfferedCourseFromDB);
exports.offeredCourseRoutes = router;
