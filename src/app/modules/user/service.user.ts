/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import { AcademicSemester } from '../academicSemester/model.academicSemester';
import { AcademicDepartment } from '../academicDepartment/model.academicDepartment';
import { TStudent } from '../students/interface.student';
import { Student } from '../students/model.student';
import { TUser } from './interface.user';
import { User } from './model.user';
import { TFaculty } from '../faculty/interface.faculty';
import { Faculty } from '../faculty/model.faculty';
import { TAdmin } from '../admin/interface.admin';
import { Admin } from '../admin/model.admin';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

// create user as a student
const createStudent = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any,
  password: string,
  studentData: TStudent,
) => {
  const userData: Partial<TUser> = {};
  // find academic semester info
  // get academic semester id from student.admissionSemester > then the id checks the admission year, code > then send the data to generateStudentId function for year and code

  // check semester id exists
  const admissionSemesterId = await AcademicSemester.findById(
    studentData.admissionSemester,
  );

  // generated id 2023010001
  if (!admissionSemesterId) {
    throw new Error('academic semester Id not found ');
  }
  // check semester id exists
  const academicDepartmentId = await AcademicDepartment.findById(
    studentData.academicDepartment,
  );

  if (!academicDepartmentId) {
    throw new Error('academic department Id not found ');
  }

  // set student role
  userData.role = 'student';
  userData.email = studentData.email;

  // set user password or use default password
  userData.password = password || (config.default_pass as string);

  // Transaction
  const session = await mongoose.startSession(); // step 1

  try {
    session.startTransaction(); // step 2

    // set generated userId
    userData.id = await generateStudentId(admissionSemesterId);

    const imageName = `${userData.id}_${studentData?.name?.firstName}`;
    const path = file?.path;

    // send Image to cloudinary
    const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
      secure_url: string;
    };

    // create new user
    const newUser = await User.create([userData], { session }); // step 3

    //create a student ->  transaction 2
    // if (Object.keys(newUser).length) {  //for using object
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set id , _id as user
    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id; //reference _id
    studentData.profileImg = secure_url;

    // create a student -> transaction 2
    const newStudent = await Student.create([studentData], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Student');
    }

    // commit transaction
    await session.commitTransaction(); // step 4 (save data into database)

    // end session
    await session.endSession(); // step 5

    return newStudent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }

  // create a user -> transaction 1
  // transaction use array
};

// create user as a faculty
const createFaculty = async (
  file: any,
  password: string,
  facultyData: TFaculty,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'faculty';
  userData.email = facultyData.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    facultyData.academicDepartment,
  );

  const imageName = `${userData.id}_${facultyData?.name?.firstName}`;
  const path = file?.path;
  // send Image to cloudinary
  const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
    secure_url: string;
  };

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  // Transaction
  const session = await mongoose.startSession(); // step 1

  try {
    session.startTransaction(); // step 2

    // set generated userId
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set faculty id , _id as user
    facultyData.id = newUser[0].id;
    facultyData.user = newUser[0]._id; //reference _id
    facultyData.profileImg = secure_url;

    // create a faculty -> transaction 2
    const newFaculty = await Faculty.create([facultyData], { session });

    // if (Object.keys(newUser).length) {  //for using object
    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // commit transaction
    await session.commitTransaction(); // step 4 (save data into database)

    // end session
    await session.endSession(); // step 5

    return newFaculty;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }

  // create a user -> transaction 1
  // transaction use array
};

// create user as a admin
const createAdmin = async (file: any, password: string, adminData: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'admin';
  userData.email = adminData.email;

  const imageName = `${userData.id}_${adminData?.name?.firstName}`;
  const path = file?.path;
  // send Image to cloudinary
  const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
    secure_url: string;
  };

  // Transaction
  const session = await mongoose.startSession(); // step 1

  try {
    session.startTransaction(); // step 2

    // set generated userId
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set faculty id , _id as user
    adminData.id = newUser[0].id;
    adminData.user = newUser[0]._id; //reference _id
    adminData.profileImg = secure_url;

    // create a faculty -> transaction 2
    const newAdmin = await Admin.create([adminData], { session });

    // if (Object.keys(newUser).length) {  //for using object
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // commit transaction
    await session.commitTransaction(); // step 4 (save data into database)

    // end session
    await session.endSession(); // step 5

    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }

  // create a user -> transaction 1
  // transaction use array
};

// get me
const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }
  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
