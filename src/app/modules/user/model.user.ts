import { Schema, model } from 'mongoose';
import { TUser } from './interface.user';

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

export const User = model<TUser>('User', userSchema);
