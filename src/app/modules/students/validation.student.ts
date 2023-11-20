import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(20, { message: "First name can't be greater than 20 characters" })
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      {
        message: 'First name must start with a capital letter',
      },
    ),
  middleName: z.string().optional(),
  lastName: z.string(),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, { message: "Father's name is required" }),
  fatherOccupation: z
    .string()
    .min(1, { message: "Father's occupation is required" }),
  fatherContactNo: z
    .string()
    .min(1, { message: "Father's contact number is required" }),
  motherName: z.string().min(1, { message: "Mother's name is required" }),
  motherOccupation: z
    .string()
    .min(1, { message: "Mother's occupation is required" }),
  motherContactNo: z
    .string()
    .min(1, { message: "Mother's contact number is required" }),
});

const localGuardianValidationSchema = z.object({
  name: z.string().min(1, { message: "Local guardian's name is required" }),
  occupation: z.string().min(1),
  contactNo: z
    .string()
    .min(1, { message: "Local guardian's contact number is required" }),
  address: z
    .string()
    .min(1, { message: "Local guardian's address is required" }),
});

export const studentValidationSchema = z.object({
  id: z.string(),
  password: z.string().max(20, { message: 'password must be within 20 char' }),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female']),
  dateOfBirth: z.string().optional(),
  email: z.string().email({ message: 'Email @ is required' }),
  contactNo: z
    .string()
    .min(1, { message: 'Contact number is required' })
    .max(14, { message: 'It should be 11 digits or 13 digits including 88' }),
  emergencyContactNo: z
    .string()
    .min(1, { message: 'Emergency contact number is required' }),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  presentAddress: z.string().min(1, { message: 'Present address is required' }),
  permanentAddress: z
    .string()
    .min(1, { message: 'Permanent address is required' }),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'blocked']),
  isDeleted: z.boolean(),
});

// Example usage:
// const validData = {
//   // ... your valid data here
// };

// try {
//   const validatedData = studentValidationSchema.parse(validData);
//   console.log("Validation passed:", validatedData);
// } catch (error) {
//   console.error("Validation failed:", error.errors);
// }
