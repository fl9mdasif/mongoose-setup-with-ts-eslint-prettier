import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppErrors';
import httpStatus from 'http-status';
import config from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUSerRole } from '../modules/user/interface.user';

const auth = (...requiredRole: TUSerRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization;

    // if token not sent
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not a authorized user',
      );
    }

    // verify a token symmetric
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not a authorized user 1',
          );
        }
        // decode
        req.user = decoded as JwtPayload;
        const role = (decoded as JwtPayload).role;
        // console.log(role);
        if (requiredRole && !requiredRole.includes(role)) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            `'${role}' is are not authorized`,
          );
        }
        next();
        // console.log(decoded); // bar
      },
    );
  });
};

export default auth;
