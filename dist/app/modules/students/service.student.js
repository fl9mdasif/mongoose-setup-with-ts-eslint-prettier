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
exports.StudentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const model_student_1 = require("./model.student");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const http_status_1 = __importDefault(require("http-status"));
const model_user_1 = require("../user/model.user");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const constant_student_1 = require("./constant.student");
const getAllStudents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // instance
    const studentQuery = new QueryBuilder_1.default(model_student_1.Student.find()
        .populate('user')
        .populate('admissionSemester')
        .populate({
        path: 'academicDepartment',
        populate: {
            path: 'academicFaculty',
        },
    }), query)
        .search(constant_student_1.studentSearchableField)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield studentQuery.modelQuery;
    return result;
});
// single user
const getSingleStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //  const result = await Student.findOne({ id }); ensure the custom id field
    const result = yield model_student_1.Student.findById(id) // ensure the mongoDB id field
        .populate('user')
        .populate('admissionSemester')
        .populate({
        path: 'academicDepartment',
        populate: {
            path: 'academicFaculty',
        },
    });
    return result;
});
// update user
const updateStudentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, guardian, localGuardian } = payload, remainingStudentData = __rest(payload, ["name", "guardian", "localGuardian"]);
    const modifiedUpdatedData = Object.assign({}, remainingStudentData);
    // console.log('UPDATE', payload);
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }
    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }
    const result = yield model_student_1.Student.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteSingleStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedStudent = yield model_student_1.Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deletedStudent) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete student');
        }
        // get user _id from deletedStudent
        const userId = deletedStudent.user;
        const deletedUser = yield model_user_1.User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete user');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedStudent;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error('Failed to delete student');
    }
});
exports.StudentServices = {
    getAllStudents,
    getSingleStudent,
    deleteSingleStudent,
    updateStudentIntoDB,
};
