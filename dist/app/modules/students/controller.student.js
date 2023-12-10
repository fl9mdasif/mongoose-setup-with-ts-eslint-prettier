"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentControllers = void 0;
const service_student_1 = require("./service.student");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const getAllStudents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_student_1.StudentServices.getAllStudents(req.query);
    // console.log();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student fetched Successfully',
        data: result,
    });
}));
// single student
const getSingleStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    const result = yield service_student_1.StudentServices.getSingleStudent(studentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Student fetched Successfully',
        data: result,
    });
}));
const updateStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    const { student } = req.body;
    // console.log('con', studentId, studentData);
    const result = yield service_student_1.StudentServices.updateStudentIntoDB(studentId, student);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student is updated successfully',
        data: result,
    });
}));
// delete a student
const deleteStudent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    yield service_student_1.StudentServices.deleteSingleStudent(studentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Student is deleted successfully',
        data: null,
    });
}));
exports.studentControllers = {
    getAllStudents,
    getSingleStudent,
    deleteStudent,
    updateStudent,
};
