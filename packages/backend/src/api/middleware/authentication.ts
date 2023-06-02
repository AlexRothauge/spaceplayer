import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';

export interface JWTUserData {
  userName: string;
  highScore: number;
  id: string;
}

export interface JWTToken extends JWTUserData {
  iat: number;
  exp: number;
}

export class Authentication {
  private static SECRET_KEY = 'JWT_SECRET';
  private static JWT_OPTIONS: jwt.SignOptions = {
    expiresIn: 3600, // in Seconds
  };
  private static SALT_ROUNDS: number = 10;

  public static async generateToken(userdata: any): Promise<string> {
    return jwt.sign(userdata, this.SECRET_KEY, this.JWT_OPTIONS);
  }

  public static async verifyToken(token: string): Promise<string | object | null> {
    try {
      return jwt.verify(token, this.SECRET_KEY);
    } catch (e) {
      return null;
    }
  }

  public static async hashPassword(password: string) {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  public static async comparePasswordWithHash(password: string, hash: string) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (e) {
      return false;
    }
  }
  public static async verifyAccess(req: Request, res: Response, next: NextFunction) {
    const jwtToken = req.get('Authorization');

    // if no Token return 401
    if (!jwtToken) {
      return res.status(401).send({
        status: 'unauthorized',
      });
    }

    // verify token
    const validToken = await Authentication.verifyToken(jwtToken);
    // if token is not valid return 401
    if (!validToken) {
      return res.status(401).send({
        status: 'unauthorized',
      });
    }

    return next();
  }
}
export const authMiddleware = async (
  req: Request,
  // tslint:disable-next-line: variable-name
  _res: Response,
  next: NextFunction,
) => {
  const token = req.get('Authorization');
  if (token) {
    try {
      req.token = (await Authentication.verifyToken(token)) as JWTToken;
    } catch (e) {
      console.log(e);
    }
  } else {
    req.token = null;
  }
  next();
};
