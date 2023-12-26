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
/* eslint-disable @typescript-eslint/no-explicit-any */
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
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
// create user as a student
const createStudent = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
file, password, studentData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    userData.email = studentData.email;
    // set user password or use default password
    userData.password = password || config_1.default.default_pass;
    // Transaction
    const session = yield mongoose_1.default.startSession(); // step 1
    try {
        session.startTransaction(); // step 2
        // set generated userId
        userData.id = yield (0, user_utils_1.generateStudentId)(admissionSemesterId);
        const imageName = `${userData.id}_${(_a = studentData === null || studentData === void 0 ? void 0 : studentData.name) === null || _a === void 0 ? void 0 : _a.firstName}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        // send Image to cloudinary
        const { secure_url } = (yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path));
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
        studentData.profileImg = secure_url;
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
const createFaculty = (file, password, facultyData) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // create a user object
    const userData = {};
    //if password is not given , use default password
    userData.password = password || config_1.default.default_pass;
    //set student role
    userData.role = 'faculty';
    userData.email = facultyData.email;
    // find academic department info
    const academicDepartment = yield model_academicDepartment_1.AcademicDepartment.findById(facultyData.academicDepartment);
    const imageName = `${userData.id}_${(_b = facultyData === null || facultyData === void 0 ? void 0 : facultyData.name) === null || _b === void 0 ? void 0 : _b.firstName}`;
    const path = file === null || file === void 0 ? void 0 : file.path;
    // send Image to cloudinary
    const { secure_url } = (yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path));
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
        facultyData.profileImg = secure_url;
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
const createAdmin = (file, password, adminData) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    // create a user object
    const userData = {};
    //if password is not given , use default password
    userData.password = password || config_1.default.default_pass;
    //set student role
    userData.role = 'admin';
    userData.email = adminData.email;
    const imageName = `${userData.id}_${(_c = adminData === null || adminData === void 0 ? void 0 : adminData.name) === null || _c === void 0 ? void 0 : _c.firstName}`;
    const path = file === null || file === void 0 ? void 0 : file.path;
    // send Image to cloudinary
    const { secure_url } = (yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path));
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
        adminData.profileImg = secure_url;
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
// get me
const getMe = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === 'student') {
        result = yield model_student_1.Student.findOne({ id: userId }).populate('user');
    }
    if (role === 'admin') {
        result = yield model_admin_1.Admin.findOne({ id: userId }).populate('user');
    }
    if (role === 'faculty') {
        result = yield model_faculty_1.Faculty.findOne({ id: userId }).populate('user');
    }
    return result;
});
const changeStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_user_1.User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
exports.UserServices = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeStatus,
};
