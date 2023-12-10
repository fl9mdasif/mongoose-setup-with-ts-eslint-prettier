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
exports.UserServices = void 0;
const config_1 = __importDefault(require("../../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const user_utils_1 = require("./user.utils");
const model_academicSemester_1 = require("../academicSemester/model.academicSemester");
const model_academicDepartment_1 = require("../academicDepartment/model.academicDepartment");
const model_student_1 = require("../students/model.student");
const model_user_1 = require("./model.user");
const model_faculty_1 = require("../faculty/model.faculty");
const model_admin_1 = require("../admin/model.admin");
// create user as a student
const createStudent = (password, studentData) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {};
    // find academic semester info
    // get academic semester id from student.admissionSemester > then the id checks the admission year, code > then send the data to generateStudentId function for year and code
    // check semester id exists
    const admissionSemesterId = yield model_academicSemester_1.AcademicSemester.findById(studentData.admissionSemester);
    // generated id 2023010001
    if (!admissionSemesterId) {
        throw new Error('academic semester Id not found ');
    }
    // check semester id exists
    const academicDepartmentId = yield model_academicDepartment_1.AcademicDepartment.findById(studentData.academicDepartment);
    if (!academicDepartmentId) {
        throw new Error('academic department Id not found ');
    }
    // set student role
    userData.role = 'student';
    // set user password or use default password
    userData.password = password || config_1.default.default_pass;
    // Transaction
    const session = yield mongoose_1.default.startSession(); // step 1
    try {
        session.startTransaction(); // step 2
        // set generated userId
        userData.id = yield (0, user_utils_1.generateStudentId)(admissionSemesterId);
        // create new user
        const newUser = yield model_user_1.User.create([userData], { session }); // step 3
        //create a student ->  transaction 2
        // if (Object.keys(newUser).length) {  //for using object
        if (!newUser.length) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        // set id , _id as user
        studentData.id = newUser[0].id;
        studentData.user = newUser[0]._id; //reference _id
        // create a student -> transaction 2
        const newStudent = yield model_student_1.Student.create([studentData], { session });
        if (!newStudent.length) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Student');
        }
        // commit transaction
        yield session.commitTransaction(); // step 4 (save data into database)
        // end session
        yield session.endSession(); // step 5
        return newStudent;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
    // create a user -> transaction 1
    // transaction use array
});
// create user as a faculty
const createFaculty = (password, facultyData) => __awaiter(void 0, void 0, void 0, function* () {
    // create a user object
    const userData = {};
    //if password is not given , use default password
    userData.password = password || config_1.default.default_pass;
    //set student role
    userData.role = 'faculty';
    // find academic department info
    const academicDepartment = yield model_academicDepartment_1.AcademicDepartment.findById(facultyData.academicDepartment);
    if (!academicDepartment) {
        throw new AppErrors_1.default(400, 'Academic department not found');
    }
    // Transaction
    const session = yield mongoose_1.default.startSession(); // step 1
    try {
        session.startTransaction(); // step 2
        // set generated userId
        userData.id = yield (0, user_utils_1.generateFacultyId)();
        // create a user (transaction-1)
        const newUser = yield model_user_1.User.create([userData], { session }); // array
        //create a faculty
        if (!newUser.length) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        // set faculty id , _id as user
        facultyData.id = newUser[0].id;
        facultyData.user = newUser[0]._id; //reference _id
        // create a faculty -> transaction 2
        const newFaculty = yield model_faculty_1.Faculty.create([facultyData], { session });
        // if (Object.keys(newUser).length) {  //for using object
        if (!newFaculty.length) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        // commit transaction
        yield session.commitTransaction(); // step 4 (save data into database)
        // end session
        yield session.endSession(); // step 5
        return newFaculty;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
    // create a user -> transaction 1
    // transaction use array
});
// create user as a admin
const createAdmin = (password, adminData) => __awaiter(void 0, void 0, void 0, function* () {
    // create a user object
    const userData = {};
    //if password is not given , use default password
    userData.password = password || config_1.default.default_pass;
    //set student role
    userData.role = 'admin';
    // Transaction
    const session = yield mongoose_1.default.startSession(); // step 1
    try {
        session.startTransaction(); // step 2
        // set generated userId
        userData.id = yield (0, user_utils_1.generateAdminId)();
        // create a user (transaction-1)
        const newUser = yield model_user_1.User.create([userData], { session }); // array
        //create a faculty
        if (!newUser.length) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        // set faculty id , _id as user
        adminData.id = newUser[0].id;
        adminData.user = newUser[0]._id; //reference _id
        // create a faculty -> transaction 2
        const newAdmin = yield model_admin_1.Admin.create([adminData], { session });
        // if (Object.keys(newUser).length) {  //for using object
        if (!newAdmin.length) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        // commit transaction
        yield session.commitTransaction(); // step 4 (save data into database)
        // end session
        yield session.endSession(); // step 5
        return newAdmin;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
    // create a user -> transaction 1
    // transaction use array
});
exports.UserServices = {
    createStudent,
    createFaculty,
    createAdmin,
};
