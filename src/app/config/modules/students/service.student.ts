import { StudentModel } from '../model.student';
import { TStudent } from './interface.student';

const createStudent = async (student: TStudent) => {
  const result = await StudentModel.create(student);
  return result;
};

const getAllStudents = async () => {
  const result = await StudentModel.find();
  return result;
};

const getSingleStudent = async (id: string) => {
  const result = await StudentModel.findOne({ id });
  return result;
};
export const StudentServices = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
