import config from '../../config';
import { generateStudentId } from './user.utils';
import { AcademicSemester } from '../academicSemester/model.academicSemester';
import { TStudent } from '../students/interface.student';
import { Student } from '../students/model.student';
import { TUser } from './interface.user';
import { User } from './model.user';
import { AcademicDepartment } from '../academicDeaptment/model.academicDepartment';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';

const createStudent = async (password: string, studentData: TStudent) => {
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

  // set user password or use default password
  userData.password = password || (config.default_pass as string);

  // Transaction
  const session = await mongoose.startSession(); // step 1

  try {
    session.startTransaction(); // step 2

    // set generated userId
    userData.id = await generateStudentId(admissionSemesterId);

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
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }

  // create a user -> transaction 1
  // transaction use array
};

export const StudentService = {
  createStudent,
};
