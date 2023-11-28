import { Student } from './model.student';

const getAllStudents = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudent = async (id: string) => {
  //  const result = await Student.findOne({ id });
  const result = Student.aggregate([{ $match: { id: id } }]);

  return result;
};

const deleteSingleStudent = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};
export const StudentServices = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
};
