import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { TLoginUser } from './interface.auth';
import { User } from '../user/model.user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken } from './utils.auth';

const loginUser = async (payload: TLoginUser) => {
  // 1. checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `This user is not found !'`);
  }

  // 2. checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, `This ${user.role} is deleted !`);
  }

  // 3. checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `This ${user.role} status is blocked ! !`,
    );
  }

  // 4. checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Password of '${user.role}' do not matched`,
    );
  // console.log(user);

  // 5. create token and sent to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  // create token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  // refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

// change password
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // 01. checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId);
  // console.log(userData);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // 02. checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, `This ${user.role} is deleted !`);
  }

  // 03. checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `This ${user.role} status is blocked !`,
    );
  }

  // 04. checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(
      httpStatus.FORBIDDEN,
      `${user.role}'s Password do not matched`,
    );

  // 05.hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  // update password
  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true, runValidators: true },
  );
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};
export const authServices = {
  loginUser,
  changePassword,
  refreshToken,
};
