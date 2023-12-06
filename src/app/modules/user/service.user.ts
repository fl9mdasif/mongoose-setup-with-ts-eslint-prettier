import config from '../../config';
import { generateStudentId } from './user.utils';
import { AcademicSemester } from '../academicSemester/model.academicSemester';
import { TStudent } from '../students/interface.student';
import { Student } from '../students/model.student';
import { TUser } from './interface.user';
import { User } from './model.user';

const createStudent = async (password: string, studentData: TStudent) => {
  const userData: Partial<TUser> = {};

  // find academic semester info
  // get academic semester id from student.admissionSemester > then the id checks the admission year, code > then send the data to generateStudentId function for year and code

  const admissionSemesterId = await AcademicSemester.findById(
    studentData.admissionSemester,
  );

  // generated id 2023010001
  if (!admissionSemesterId) {
    throw new Error('academic semester Id not found ');
  }
  userData.id = await generateStudentId(admissionSemesterId);

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
