import jwt from 'jsonwebtoken';

export const signToken = (_id: string): string => {
    return jwt.sign({ _id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

export const promisifiedVerify = (token: string, secret: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  };
  