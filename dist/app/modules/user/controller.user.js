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
exports.userControllers = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const service_user_1 = require("./service.user");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const createStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, student: StudentData } = req.body;
        // console.log(req.body);
        const result = yield service_user_1.UserServices.createStudent(req.file, password, StudentData);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Student Created Successfully',
            data: result,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        next(err);
    }
});
// faculty
const createFaculty = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, faculty: facultyData } = req.body;
    const result = yield service_user_1.UserServices.createFaculty(req.file, password, facultyData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Faculty is created successfully',
        data: result,
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, admin: adminData } = req.body;
    const result = yield service_user_1.UserServices.createAdmin(req.file, password, adminData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin is created successfully',
        data: result,
    });
}));
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Token not found !');
    }
    const { userId, role } = req.user;
    const result = yield service_user_1.UserServices.getMe(userId, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `${role} is retrieved successfully`,
        data: result,
    });
}));
const changeStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield service_user_1.UserServices.changeStatus(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `${result === null || result === void 0 ? void 0 : result.role} Status is updated successfully`,
        data: result,
    });
}));
exports.userControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeStatus,
};
