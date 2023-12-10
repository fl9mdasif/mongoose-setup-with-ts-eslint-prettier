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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterServices = void 0;
const constant_academicSemester_1 = require("./constant.academicSemester");
const model_academicSemester_1 = require("./model.academicSemester");
const createAcademicSemesterIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // semester name --> semester code
    // academicSemesterNameCodeMapper['Fall']
    if (constant_academicSemester_1.academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid Semester Code');
    }
    const result = yield model_academicSemester_1.AcademicSemester.create(payload);
    return result;
});
// get all
const getAllSemesterFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_academicSemester_1.AcademicSemester.find();
    return result;
});
// get single
const getSingleSemesterFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_academicSemester_1.AcademicSemester.findById(id);
    return result;
});
// update semester
const updateAcademicSemesterIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.name &&
        payload.code &&
        constant_academicSemester_1.academicSemesterNameCodeMapper[payload.name] !== payload.code) {
        throw new Error('Invalid Semester Code');
    }
    const result = yield model_academicSemester_1.AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
exports.AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllSemesterFromDB,
    getSingleSemesterFromDB,
    updateAcademicSemesterIntoDB,
};
