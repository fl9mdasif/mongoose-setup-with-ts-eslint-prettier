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
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const http_status_1 = __importDefault(require("http-status"));
// sub schema
const userNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        maxlength: [20, "first name can't be greater than 20 by length"],
        validate: function (value) {
            // validate mongoose inbuilt validator
            const nameCapitalized = value.charAt(0).toUpperCase() + value.slice(1);
            return value === nameCapitalized;
        },
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
}, { _id: false });
// sub schema
const guardianSchema = new mongoose_1.Schema({
    fatherName: {
        type: String,
        required: [true, "Father's name is required"],
    },
    fatherOccupation: {
        type: String,
        required: true,
    },
    fatherContactNo: {
        type: String,
        required: [true, "Father's contact number is required"],
    },
    motherName: {
        type: String,
        required: [true, "Mother's name is required"],
    },
    motherOccupation: {
        type: String,
        required: [true, "Mother's occupation is required"],
    },
    motherContactNo: {
        type: String,
        required: [true, "Mother's contact number is required"],
    },
}, { _id: false });
// sub schema
const localGuardianSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Local guardian's name is required"],
    },
    occupation: {
        type: String,
        required: [true, "Local guardian's occupation is required"],
    },
    contactNo: {
        type: String,
        required: [true, "Local guardian's contact number is required"],
    },
    address: {
        type: String,
        required: [true, "Local guardian's address is required"],
    },
}, { _id: false });
const studentSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, 'ID is required'],
        unique: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User',
    },
    name: {
        type: userNameSchema,
        required: [true, 'Name is required'],
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not a valid gender',
        },
        required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: String },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
        type: String,
        required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
        type: String,
        enum: {
            values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message: '{VALUE} is not a valid blood group',
        },
    },
    presentAddress: {
        type: String,
        required: [true, 'Present address is required'],
    },
    permanentAddress: {
        type: String,
        required: [true, 'Permanent address is required'],
    },
    guardian: {
        type: guardianSchema,
        required: [true, 'Guardian information is required'],
    },
    localGuardian: {
        type: localGuardianSchema,
        required: [true, 'Local guardian information is required'],
    },
    admissionSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'academic_id is required'],
        ref: 'AcademicSemester',
    },
    profileImg: { type: String },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicDepartment',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: {
        virtuals: true,
    },
});
// Virtual adds a new field
studentSchema.virtual('fullName').get(function () {
    return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});
// Query Middleware
studentSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
studentSchema.pre('findOne', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.find({ isDeleted: { $ne: true } });
        next();
    });
});
studentSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
// creating middleware
studentSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isStudentExist = yield exports.Student.findOne({
            email: this.email,
        });
        if (isStudentExist) {
            throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'This email is already exist!');
        }
        next();
    });
});
// creating custom static methods
studentSchema.statics.isUserExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield exports.Student.findOne({ id });
        return existingUser;
    });
};
// studentSchema.pre('findOneAndUpdate', async function (next) {
//   const isStudentExists = await Student.findOne({ id: this.id });
//   const isUserExists = await User.findOne({ id: this.id });
//   if (!isStudentExists && isUserExists) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Students does not exists !');
//   }
//   next();
// });
exports.Student = (0, mongoose_1.model)('Student', studentSchema);
// 'Student' is the collection name
