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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseServices = void 0;
const model_course_1 = require("./model.course");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const constant_course_1 = require("./constant.course");
const mongoose_1 = __importDefault(require("mongoose"));
// create
const createCourse = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_course_1.Course.create(payload);
    return result;
});
// get all
const getAllCourse = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const courseQuery = new QueryBuilder_1.default(model_course_1.Course.find().populate('preRequisiteCourses.course'), query)
        .search(constant_course_1.CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield courseQuery.modelQuery;
    return result;
});
// get single
const getSingleCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = model_course_1.Course.findById(id).populate('preRequisiteCourses.course');
    return result;
});
// update course error
const updateCourse = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const { preRequisiteCourses } = updatedData, courseRemainingData = __rest(updatedData, ["preRequisiteCourses"]);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Basic update
        const updatedBasicCourseInfo = yield model_course_1.Course.findByIdAndUpdate(id, courseRemainingData, { new: true, runValidators: true, session });
        if (!updatedBasicCourseInfo) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update course');
        }
        // Update preRequisiteCourse
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            // Filter out the deleted fields
            const deletedPreRequisites = preRequisiteCourses
                .filter((el) => el.course && el.isDeleted)
                .map((el) => el.course);
            // Remove preRequisiteCourse
            const deletedPreRequisiteCourses = yield model_course_1.Course.findByIdAndUpdate(id, {
                $pull: {
                    preRequisiteCourses: { course: { $in: deletedPreRequisites } },
                },
            }, { new: true, runValidators: true, session });
            if (!deletedPreRequisiteCourses) {
                throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update course');
            }
            // Filter out the new course fields
            const newPreRequisites = preRequisiteCourses === null || preRequisiteCourses === void 0 ? void 0 : preRequisiteCourses.filter((el) => el.course && !el.isDeleted);
            const newPreRequisiteCourses = yield model_course_1.Course.findByIdAndUpdate(id, {
                $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
            }, {
                // upsert: true,
                new: true,
                runValidators: true,
                session,
            });
            if (!newPreRequisiteCourses) {
                throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update course');
            }
            const result = yield model_course_1.Course.findById(id).populate('preRequisiteCourses.course');
            return result;
        }
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (err) {
        session.abortTransaction();
        session.endSession();
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update course');
    }
});
// delete
const deleteCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCourse = yield model_course_1.Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedCourse) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete course');
    }
    return deletedCourse;
});
// assign course faculty
const assignFacultiesWithCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_course_1.CourseFaculty.findByIdAndUpdate(id, {
        course: id,
        $addToSet: { faculties: { $each: payload } },
    }, {
        upsert: true,
        new: true,
    });
    return result;
});
const removeFacultiesFromCourseFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_course_1.CourseFaculty.findByIdAndUpdate(id, {
        $pull: { faculties: { $in: payload } },
    }, {
        new: true,
    });
    return result;
});
exports.courseServices = {
    createCourse,
    getAllCourse,
    getSingleCourse,
    updateCourse,
    deleteCourse,
    assignFacultiesWithCourseIntoDB,
    removeFacultiesFromCourseFromDB,
};
