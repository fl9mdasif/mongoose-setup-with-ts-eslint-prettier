import mongoose from 'mongoose';
import { TStudent } from './interface.student';
import { Student } from './model.student';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';
import { User } from '../user/model.user';

const getAllStudents = async (query: Record<string, unknown>) => {
  //
  const studentSearchableField = [
    'email',
    'name.firstName',
    'name.middleName',
    'name.LastName',
    'guardian.fatherName',
    'permanentAddress',
  ];

  // copy query
  const queryObj = { ...query };

  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }

  // full match with key and value
  const searchQuery = Student.find({
    $or: studentSearchableField.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  // filter
  const excludeQuery = ['searchTerm', 'sort', 'limit', 'page'];
  excludeQuery.forEach((el) => delete queryObj[el]);

  // filter query exact match
  const filterQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  // sort query
  let sort = '-createdAt';

  if (query.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  //limit query
  let limit = 1;
  let skip = 0;

  if (query.limit) {
    limit = Number(query.limit);
  }

  // pagination

  let page = 1;
  if (query.page) {
    page = Number(query.page);
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip);

  const limitQuery = await paginateQuery.limit(limit);
  return limitQuery;
};

// single user
const getSingleStudent = async (id: string) => {
  //  const result = await Student.findOne({ id });
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  return result;
};

// update user
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };
  // console.log('UPDATE', payload);

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate(
    { id: id },
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );
  return result;
};

const deleteSingleStudent = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    // delete user

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const StudentServices = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
  updateStudentIntoDB,
};
