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
exports.semesterRegistrationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const model_academicSemester_1 = require("../academicSemester/model.academicSemester");
const model_semesterRegistration_1 = require("./model.semesterRegistration");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const constant_semesterRegistration_1 = require("./constant.semesterRegistration");
const createSemesterRegistration = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // find academic sem
    const academicSemester = payload === null || payload === void 0 ? void 0 : payload.academicSemester;
    // check is there any register semester which is "UPCOMING" or "ONGOING" for a student
    const isThereAnyUpcomingOrOngoingSEmester = yield model_semesterRegistration_1.SemesterRegistration.findOne({
        $or: [
            { status: constant_semesterRegistration_1.RegistrationStatus.UPCOMING },
            { status: constant_semesterRegistration_1.RegistrationStatus.ONGOING },
        ],
    });
    if (isThereAnyUpcomingOrOngoingSEmester) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `There is already an ${isThereAnyUpcomingOrOngoingSEmester.status} registered semester !`);
    }
    // check semester is exists
    const isAcademicSemesterExists = yield model_academicSemester_1.AcademicSemester.findById(academicSemester);
    if (!isAcademicSemesterExists) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'This academic Semester not exists');
    }
    // check if the semester is registered ??
    const isSemesterRegistrationExists = yield model_semesterRegistration_1.SemesterRegistration.findOne({
        academicSemester,
    });
    if (isSemesterRegistrationExists) {
        throw new AppErrors_1.default(http_status_1.default.CONFLICT, 'This Semester is already registered');
    }
    const result = model_semesterRegistration_1.SemesterRegistration.create(payload);
    return result;
});
// get all
const getAllSemesterRegistrations = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const semesterRegistrationQuery = new QueryBuilder_1.default(model_semesterRegistration_1.SemesterRegistration.find().populate('academicSemester'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield semesterRegistrationQuery.modelQuery;
    return result;
});
// get single
const getSingleSemesterRegistration = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_semesterRegistration_1.SemesterRegistration.findById(id).populate('academicSemester');
    return result;
});
// update semesterRegistration
const updateSemesterRegistration = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isSemesterRegistrationExists = yield model_semesterRegistration_1.SemesterRegistration.findById(id);
    if (!isSemesterRegistrationExists) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'This semester is not found !');
    }
    //if the requested semester registration is ended , we will not update anything
    const currentSemesterStatus = isSemesterRegistrationExists === null || isSemesterRegistrationExists === void 0 ? void 0 : isSemesterRegistrationExists.status;
    const requestedStatus = payload === null || payload === void 0 ? void 0 : payload.status;
    if (currentSemesterStatus === constant_semesterRegistration_1.RegistrationStatus.ENDED) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `This semester is already ${currentSemesterStatus}`);
    }
    if (currentSemesterStatus === constant_semesterRegistration_1.RegistrationStatus.UPCOMING &&
        requestedStatus === constant_semesterRegistration_1.RegistrationStatus.ENDED) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`);
    }
    if (currentSemesterStatus === constant_semesterRegistration_1.RegistrationStatus.ONGOING &&
        requestedStatus === constant_semesterRegistration_1.RegistrationStatus.UPCOMING) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`);
    }
    const result = yield model_semesterRegistration_1.SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.semesterRegistrationServices = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
};
