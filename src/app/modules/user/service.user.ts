import config from '../../config';
import { TStudent } from '../students/interface.student';
import { Student } from '../students/model.student';
import { TUser } from './interface.user';
import { User } from './model.user';

const createStudent = async (password: string, studentData: TStudent) => {
  // built in static instance method
  //   if (await Student.isUserExists(studentData.id)) {
  //     throw new Error('Student already exists');
  //   }

  const userData: Partial<TUser> = {};

  // manually created id
  userData.id = '203010001';
  // set student role
  userData.role = 'student';
  userData.password = password || (config.default_pass as string);

  // create a user
  const newUser = await User.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    // set id , _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; //reference _id

    // create a student
    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const StudentService = {
  createStudent,
};
