"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFaculty = void 0;
const mongoose_1 = require("mongoose");
const academicFacultySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
// academicFacultySchema.pre('save', async function (next) {
//   const isDepartmentExist = await AcademicFaculty.findOne({
//     name: this.name,
//   });
//   if (isDepartmentExist) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This faculty is already exist!');
//   }
//   next();
// });
exports.AcademicFaculty = (0, mongoose_1.model)('AcademicFaculty', academicFacultySchema);
