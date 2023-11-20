import { Student } from '../model.student';
import { TStudent } from './interface.student';

const createStudent = async (studentData: TStudent) => {
  // built in static instance method
  if (await Student.isUserExists(studentData.id)) {
    throw new Error('Student already exists');
  }
  const result = await Student.create(studentData);

  // # instance
  // built in instance method
  // const student = new Student(studentData);
  // if (await student.isUserExists(studentData.id)) {
  //   throw new Error('student already exists');
  // }
  // const result = await student.save();

  return result;
};

const getAllStudents = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudent = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

const deleteSingleStudent = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};
export const StudentServices = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
};
