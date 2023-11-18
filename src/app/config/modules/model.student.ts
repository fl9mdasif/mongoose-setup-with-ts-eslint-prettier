import { Schema, model } from 'mongoose';
import {
  Guardian,
  LocalGuardian,
  TStudent,
  UserName,
} from './students/interface.student';

// sub schema
const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
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
const guardianSchema = new Schema<Guardian>({
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
const localGuardianSchema = new Schema<LocalGuardian>({
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

const studentSchema = new Schema<TStudent>({
  id: {
    type: String,
    unique: true,
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
  isActive: {
    type: String,
    enum: {
      values: ['active', 'blocked'],
      message: '{VALUE} is not a valid status',
    },
    required: [true, 'Status is required'],
    default: 'active',
  },
});

export const StudentModel = model<TStudent>('Student', studentSchema);

// Student is the collection name
