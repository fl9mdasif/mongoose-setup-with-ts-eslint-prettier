import { Schema, model } from 'mongoose';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './interface.student';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';

// sub schema
const userNameSchema = new Schema<TUserName>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      maxlength: [20, "first name can't be greater than 20 by length"],
      validate: function (value: string) {
        // validate mongoose inbuilt validator

        const nameCapitalized = value.charAt(0).toUpperCase() + value.slice(1);
        return value === nameCapitalized;
      },
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
  },
  { _id: false },
);

// sub schema
const guardianSchema = new Schema<TGuardian>(
  {
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
    },
    fatherOccupation: {
      type: String,
      required: true,
    },
    fatherContactNo: {
      type: String,
      required: [true, "Father's contact number is required"],
    },
    motherName: {
      type: String,
      required: [true, "Mother's name is required"],
    },
    motherOccupation: {
      type: String,
      required: [true, "Mother's occupation is required"],
    },
    motherContactNo: {
      type: String,
      required: [true, "Mother's contact number is required"],
    },
  },
  { _id: false },
);

// sub schema
const localGuardianSchema = new Schema<TLocalGuardian>(
  {
    name: {
      type: String,
      required: [true, "Local guardian's name is required"],
    },
    occupation: {
      type: String,
      required: [true, "Local guardian's occupation is required"],
    },
    contactNo: {
      type: String,
      required: [true, "Local guardian's contact number is required"],
    },
    address: {
      type: String,
      required: [true, "Local guardian's address is required"],
    },
  },
  { _id: false },
);

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian information is required'],
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'academic_id is required'],
      ref: 'AcademicSemester',
    },
    profileImg: { type: String },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// Virtual adds a new field

studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// Query Middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// creating middleware
studentSchema.pre('save', async function (next) {
  const isStudentExist = await Student.findOne({
    email: this.email,
  });

  if (isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This email is already exist!');
  }

  next();
});

// creating custom static methods
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

// custom instance method
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

export const Student = model<TStudent, StudentModel>('Student', studentSchema);

// 'Student' is the collection name
