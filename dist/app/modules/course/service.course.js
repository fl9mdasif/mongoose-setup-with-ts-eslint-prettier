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
exports.courseServices = void 0;
const model_course_1 = require("./model.course");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const constant_course_1 = require("./constant.course");
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
// update
const updateCourse = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = model_course_1.Course.findByIdAndUpdate(id, updatedData, { new: true });
    return result;
});
// delete
const deleteCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCourse = yield model_course_1.Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedCourse) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete course');
    }
    return deletedCourse;
});
exports.courseServices = {
    createCourse,
    getAllCourse,
    getSingleCourse,
    updateCourse,
    deleteCourse,
};
