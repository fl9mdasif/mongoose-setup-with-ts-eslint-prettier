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
exports.AcademicSemester = void 0;
const mongoose_1 = require("mongoose");
const constant_academicSemester_1 = require("./constant.academicSemester");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const http_status_1 = __importDefault(require("http-status"));
const academicSemesterSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        enum: constant_academicSemester_1.AcademicSemesterName,
    },
    year: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        enum: constant_academicSemester_1.AcademicSemesterCode,
    },
    startMonth: {
        type: String,
        required: true,
        enum: constant_academicSemester_1.Months,
    },
    endMonth: {
        type: String,
        required: true,
        enum: constant_academicSemester_1.Months,
    },
}, {
    timestamps: true,
});
academicSemesterSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isSemesterExists = yield exports.AcademicSemester.findOne({
            year: this.year,
            name: this.name,
        });
        if (isSemesterExists) {
            throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Semester is already exists !');
        }
        next();
    });
});
exports.AcademicSemester = (0, mongoose_1.model)('AcademicSemester', academicSemesterSchema);
// Name Year
// 2030 Autumn => Created
// 2031 Autumn
// 2030 Autumn => XXX
// 2030 Fall => Created
// Autumn 01
// Summer 02
// Fall 03
