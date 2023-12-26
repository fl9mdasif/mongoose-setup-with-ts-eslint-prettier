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
exports.enrolledCourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const model_offeredCourse_1 = require("../offeredCourse/model.offeredCourse");
const model_enrolledCourse_1 = __importDefault(require("./model.enrolledCourse"));
const model_student_1 = require("../students/model.student");
const model_course_1 = require("../course/model.course");
const model_semesterRegistration_1 = require("../semesterRegistration/model.semesterRegistration");
const mongoose_1 = __importDefault(require("mongoose"));
const model_faculty_1 = require("../faculty/model.faculty");
const utils_enrolledCourse_1 = require("./utils.enrolledCourse");
const createEnrolledCourse = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Step1: Check if the offered courses is exists
     * Step2: Check if the student is already enrolled
     * Step3: Check if the max credits exceed
     * Step4: Create an enrolled course
     */
    const { offeredCourse } = payload;
    // console.log(payload);
    // 01
    const isOfferedCourseExists = yield model_offeredCourse_1.OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Offered course not found !');
    }
    // 02
    const student = yield model_student_1.Student.findOne({ id: userId }, { _id: 1 });
    if (!student) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Student not found !');
    }
    // already enrolled?
    const isStudentAlreadyEnrolled = yield model_enrolledCourse_1.default.findOne({
        semesterRegistration: isOfferedCourseExists === null || isOfferedCourseExists === void 0 ? void 0 : isOfferedCourseExists.semesterRegistration,
        offeredCourse,
        student: student._id,
    });
    if (isStudentAlreadyEnrolled) {
        throw new AppErrors_1.default(http_status_1.default.CONFLICT, 'Student is already enrolled !');
    }
    // check max capacity
    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppErrors_1.default(http_status_1.default.BAD_GATEWAY, 'Room is full !');
    }
    // 03 check total credits exceeds maxCredit
    const course = yield model_course_1.Course.findById(isOfferedCourseExists.course);
    const currentCredit = course === null || course === void 0 ? void 0 : course.credits;
    // search semester registration
    const semesterRegistration = yield model_semesterRegistration_1.SemesterRegistration.findById(isOfferedCourseExists.semesterRegistration).select('maxCredit');
    const maxCredit = semesterRegistration === null || semesterRegistration === void 0 ? void 0 : semesterRegistration.maxCredit;
    const enrolledCourses = yield model_enrolledCourse_1.default.aggregate([
        {
            $match: {
                semesterRegistration: isOfferedCourseExists.semesterRegistration,
                student: student._id,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourseData',
            },
        },
        {
            $unwind: '$enrolledCourseData',
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
            },
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1,
            },
        },
    ]);
    // //  total enrolled credits + new enrolled course credit > maxCredit
    const totalCredits = enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
    if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'You have exceeded maximum number of credits !');
    }
    // Transaction
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction(); // 04
        const result = yield model_enrolledCourse_1.default.create([
            {
                semesterRegistration: isOfferedCourseExists.semesterRegistration,
                academicSemester: isOfferedCourseExists.academicSemester,
                academicFaculty: isOfferedCourseExists.academicFaculty,
                academicDepartment: isOfferedCourseExists.academicDepartment,
                offeredCourse: offeredCourse,
                course: isOfferedCourseExists.course,
                student: student._id,
                faculty: isOfferedCourseExists.faculty,
                isEnrolled: true,
            },
        ]);
        // console.log(enrolledCourses);
        // console.log(result);
        if (!result) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'failed to enrolled the course');
        }
        // update max capacity
        const maxCapacity = isOfferedCourseExists.maxCapacity;
        yield model_offeredCourse_1.OfferedCourse.findByIdAndUpdate(offeredCourse, {
            maxCapacity: maxCapacity - 1,
        });
        // commit transaction
        yield session.commitTransaction(); // step 4 (save data into database)
        // end session
        yield session.endSession(); // step 5
        return result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const updateEnrolledCourseMarks = (facultyId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
    const isSemesterRegistrationExists = yield model_semesterRegistration_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Semester registration not found !');
    }
    const isOfferedCourseExists = yield model_offeredCourse_1.OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Offered course not found !');
    }
    const isStudentExists = yield model_student_1.Student.findById(student);
    if (!isStudentExists) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Student not found !');
    }
    const faculty = yield model_faculty_1.Faculty.findOne({ id: facultyId }, { _id: 1 });
    if (!faculty) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Faculty not found !');
    }
    const isCourseBelongToFaculty = yield model_enrolledCourse_1.default.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty._id,
    });
    // console.log(isCourseBelongToFaculty);
    if (!isCourseBelongToFaculty) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'You are forbidden! !');
    }
    const modifiedData = Object.assign({}, courseMarks);
    if (courseMarks === null || courseMarks === void 0 ? void 0 : courseMarks.finalTerm) {
        const { classTest1, classTest2, midTerm, finalTerm } = isCourseBelongToFaculty.courseMarks;
        const totalMarks = Math.ceil(classTest1 * 0.1) +
            Math.ceil(midTerm * 0.3) +
            Math.ceil(classTest2 * 0.1) +
            Math.ceil(finalTerm * 0.5);
        const result = (0, utils_enrolledCourse_1.calculateGradeAndPoints)(totalMarks);
        // console.log(result);
        modifiedData.grade = result.grade;
        modifiedData.gradePoints = result.gradePoints;
        modifiedData.isCompleted = true;
    }
    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value;
        }
    }
    const result = yield model_enrolledCourse_1.default.findByIdAndUpdate(isCourseBelongToFaculty._id, modifiedData, {
        new: true,
    });
    return result;
});
exports.enrolledCourseServices = {
    createEnrolledCourse,
    updateEnrolledCourseMarks,
};
