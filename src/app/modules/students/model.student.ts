import { Schema, model } from 'mongoose';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './interface.student';
import bcrypt from 'bcrypt';
import config from '../../config';

// sub schema
const userNameSchema = new Schema<TUserName>({
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
});

// sub schema
const guardianSchema = new Schema<TGuardian>({
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
});

// sub schema
const localGuardianSchema = new Schema<TLocalGuardian>({
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
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user Id is required'],
      unique: true,
      ref: 'User', // which model to reference
    },
    name: userNameSchema,
    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: '{VALUE} is not matched',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
      maxlength: [14, 'It should be 11 digit or 13 digit include 88'],
    },
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
    guardian: guardianSchema,
    localGuardian: localGuardianSchema,
    profileImg: { type: String },

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
  this.find({ isDeleted: { $ne: true } }); // checks isDeleted
  next();
});

studentSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } }); // checks isDeleted
  next();
});

// match and return if isDeleted is false?

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
// creating middleware

studentSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const student = this;

  // Store hash in your password DB.

  student.password = await bcrypt.hash(
    student.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// after staved data that works {password = ""}
studentSchema.post('save', function (document, next) {
  document.password = '';
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
