import { Schema, model } from 'mongoose';
import { TAcademicFaculty } from './interface.academicFaculty';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

academicFacultySchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicFaculty.findOne({
    name: this.name,
  });

  if (isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This faculty is already exist!');
  }

  next();
});

export const AcademicFaculty = model<TAcademicFaculty>(
  'AcademicFaculty',
  academicFacultySchema,
);
