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
exports.FacultyServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const model_faculty_1 = require("./model.faculty");
const constant_faculty_1 = require("./constant.faculty");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const model_user_1 = require("../user/model.user");
// get all
const getAllFacultiesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const facultyQuery = new QueryBuilder_1.default(model_faculty_1.Faculty.find().populate('academicDepartment'), query)
        .search(constant_faculty_1.FacultySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield facultyQuery.modelQuery;
    return result;
});
const getSingleFacultyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_faculty_1.Faculty.findById(id).populate('academicDepartment');
    return result;
});
// update
const updateFacultyIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload, remainingFacultyData = __rest(payload, ["name"]);
    const modifiedUpdatedData = Object.assign({}, remainingFacultyData);
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    const result = yield model_faculty_1.Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
// delete
const deleteFacultyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deletedFaculty = yield model_faculty_1.Faculty.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
        if (!deletedFaculty) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete faculty');
        }
        // get user _id from deletedFaculty
        const userId = deletedFaculty.user;
        const deletedUser = yield model_user_1.User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete user');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedFaculty;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.FacultyServices = {
    getAllFacultiesFromDB,
    getSingleFacultyFromDB,
    updateFacultyIntoDB,
    deleteFacultyFromDB,
};
