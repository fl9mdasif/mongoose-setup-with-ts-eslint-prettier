import { Schema, model } from 'mongoose';
import { TUser } from './interface.user';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, default: true },
    role: { type: String, enum: ['student', 'admin', 'faculty'] },
    status: { type: String, enum: ['in-progress', 'blocked'] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // gives create update time
  },
);

// hash the password
userSchema.pre('save', async function (next) {
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
userSchema.post('save', function (document, next) {
  document.password = '';
  next();
});

export const User = model<TUser>('User', userSchema);
