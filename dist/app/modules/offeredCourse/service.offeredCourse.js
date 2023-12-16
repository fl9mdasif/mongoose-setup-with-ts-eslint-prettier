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
exports.OfferedCourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const model_semesterRegistration_1 = require("../semesterRegistration/model.semesterRegistration");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const model_academicFaculty_1 = require("../academicFaculty/model.academicFaculty");
const model_academicDepartment_1 = require("../academicDepartment/model.academicDepartment");
const model_course_1 = require("../course/model.course");
const model_faculty_1 = require("../faculty/model.faculty");
const model_offeredCourse_1 = require("./model.offeredCourse");
const createOfferedCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, academicFaculty, academicDepartment, course, section, faculty, days, startTime, endTime, } = payload;
    /**
     * Step 1: check if the semester registration id is exists!
     * Step 2: check if the academic faculty id is exists!
     * Step 3: check if the academic department id is exists!
     * Step 4: check if the course id is exists!
     * Step 5: check if the faculty id is exists!
     * Step 6: check if the department is belong to the  faculty
     * Step 7: check if the same offered course same section in same registered semester exists
     * Step 8: get the schedules of the faculties
     * Step 9: check if the faculty is available at that time. If not then throw error
     * Step 10: create the offered course
     */
    //check if the semester registration id is exists!
    const isSemesterRegistrationExits = yield model_semesterRegistration_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExits) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Semester registration not found !');
    }
    const academicSemester = isSemesterRegistrationExits.academicSemester;
    const isAcademicFacultyExits = yield model_academicFaculty_1.AcademicFaculty.findById(academicFaculty);
    if (!isAcademicFacultyExits) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Academic Faculty not found !');
    }
    const isAcademicDepartmentExits = yield model_academicDepartment_1.AcademicDepartment.findById(academicDepartment);
    if (!isAcademicDepartmentExits) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Academic Department not found !');
    }
    const isCourseExits = yield model_course_1.Course.findById(course);
    if (!isCourseExits) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Course not found !');
    }
    const isFacultyExits = yield model_faculty_1.Faculty.findById(faculty);
    if (!isFacultyExits) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found !');
    }
    // check if the department is belong to the  faculty
    const isDepartmentBelongToFaculty = yield model_academicDepartment_1.AcademicDepartment.findOne({
        _id: academicDepartment,
        academicFaculty,
    });
    if (!isDepartmentBelongToFaculty) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `This ${isAcademicDepartmentExits.name} is not  belong to this ${isAcademicFacultyExits.name}`);
    }
    // check if the same offered course same section in same registered semester exists
    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = yield model_offeredCourse_1.OfferedCourse.findOne({
        semesterRegistration,
        course,
        section,
    });
    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `Offered course with same section is already exist!`);
    }
    //   // get the schedules of the faculties
    //   const assignedSchedules = await OfferedCourse.find({
    //     semesterRegistration,
    //     faculty,
    //     days: { $in: days },
    //   }).select('days startTime endTime');
    //   const newSchedule = {
    //     days,
    //     startTime,
    //     endTime,
    //   };
    //   if (hasTimeConflict(assignedSchedules, newSchedule)) {
    //     throw new AppError(
    //       httpStatus.CONFLICT,
    //       `This faculty is not available at that time ! Choose other time or day`,
    //     );
    //   }
    const result = yield model_offeredCourse_1.OfferedCourse.create(Object.assign(Object.assign({}, payload), { academicSemester }));
    return result;
});
const getAllOfferedCoursesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const offeredCourseQuery = new QueryBuilder_1.default(model_offeredCourse_1.OfferedCourse.find(), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield offeredCourseQuery.modelQuery;
    return result;
});
const getSingleOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const offeredCourse = yield model_offeredCourse_1.OfferedCourse.findById(id);
    if (!offeredCourse) {
        throw new AppErrors_1.default(404, 'Offered Course not found');
    }
    return offeredCourse;
});
const updateOfferedCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the faculty exists
     * Step 3: check if the semester registration status is upcoming
     * Step 4: check if the faculty is available at that time. If not then throw error
     * Step 5: update the offered course
     */
    const { faculty, days, startTime, endTime } = payload;
    const isOfferedCourseExists = yield model_offeredCourse_1.OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Offered course not found !');
    }
    const isFacultyExists = yield model_faculty_1.Faculty.findById(faculty);
    if (!isFacultyExists) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found !');
    }
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    // get the schedules of the faculties
    // Checking the status of the semester registration
    const semesterRegistrationStatus = yield model_semesterRegistration_1.SemesterRegistration.findById(semesterRegistration);
    if ((semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status) !== 'UPCOMING') {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `You can not update this offered course as it is ${semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status}`);
    }
    // check if the faculty is available at that time.
    const assignedSchedules = yield model_offeredCourse_1.OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');
    const newSchedule = {
        days,
        startTime,
        endTime,
    };
    //   if (hasTimeConflict(assignedSchedules, newSchedule)) {
    //     throw new AppError(
    //       httpStatus.CONFLICT,
    //       `This faculty is not available at that time ! Choose other time or day`,
    //     );
    //   }
    const result = yield model_offeredCourse_1.OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the semester registration status is upcoming
     * Step 3: delete the offered course
     */
    const isOfferedCourseExists = yield model_offeredCourse_1.OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Offered Course not found');
    }
    const semesterRegistration = isOfferedCourseExists.semesterRegistration;
    const semesterRegistrationStatus = yield model_semesterRegistration_1.SemesterRegistration.findById(semesterRegistration).select('status');
    if ((semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status) !== 'UPCOMING') {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `Offered course can not update ! because the semester ${semesterRegistrationStatus}`);
    }
    const result = yield model_offeredCourse_1.OfferedCourse.findByIdAndDelete(id);
    return result;
});
exports.OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    deleteOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
};
