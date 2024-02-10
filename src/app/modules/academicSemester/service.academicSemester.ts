import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import {
  AcademicSemesterSearchableFields,
  academicSemesterNameCodeMapper,
} from './constant.academicSemester';
import { TAcademicSemester } from './interface.academicSemester';
import { AcademicSemester } from './model.academicSemester';
import QueryBuilder from '../../builder/QueryBuilder';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // semester name --> semester code
  // academicSemesterNameCodeMapper['Fall']
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid Semester Code',
      'semesterCode',
    );
  }

  const result = await AcademicSemester.create(payload);

  return result;
};

// get all
const getAllSemesterFromDB = async (query: Record<string, unknown>) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get single
const getSingleSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

// update semester
const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllSemesterFromDB,
  getSingleSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
