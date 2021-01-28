import { AppError } from '../exceptions/AppError';
import { ISignupClaims } from '../models/requests/IIDPSignupRequest';
import { ILoginRequest } from '../models/requests/ILoginRequest';
import { ISignupRequest } from '../models/requests/ISignupRequest';
import { Role } from '../models/Role';
import { Status } from '../models/Status';
import { UserAccountRepository } from '../repositories/UserAccounts';
import loggerFactory from '../utils/logging';
import validators from '../utils/validators';
import { BaseService } from './BaseService';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import jwt from 'jsonwebtoken';
import { IClaims } from '../models/ITokenWithUser';
import config from '../config';
const logger = loggerFactory.getLogger('AuthService');

export class AuthService extends BaseService {
  constructor() {
    super();
  }

  protected get userAccountRepo() {
    return new UserAccountRepository();
  }

  async login(body: ILoginRequest) {
    validators.validateUser(body);
    const { username, password } = body;
    const result = await this.userAccountRepo.findOne({ username });
    if (!result) throw new UnauthorizedError('Invalid username and password!');
    const isEqual = await bcrypt.compare(password, result.password);
    if (!isEqual) throw new UnauthorizedError('Invalid username and password!');
    return {
      access_token: this.getToken({ ...result, password: undefined }),
      expires_in: config.tokenExpiresIn,
      user: result,
    };
  }

  async signup(body: ISignupRequest) {
    validators.validateCreateUser(body);
    const { firstname, email, lastname, password, contact } = body;
    const _password = await this.generatePasswordhash(password);
    const _signupRequest: ISignupClaims = {
      firstname,
      lastname,
      email,
      status: Status.active,
      role: Role.staff,
      contact,
      password: _password,
      username: email,
    };

    try {
      await this.userAccountRepo.save(_signupRequest);
      return this.login({ username: _signupRequest.username, password });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err && err.code === 11000) {
        throw new AppError('Email exists', 'Entered email has already been taken');
      } else throw err;
    }
  }

  private getToken(payload: Partial<IClaims>) {
    const key = `
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDEizXXGfMuKn+NtpUsSWvfrAeHBxB10mD8lMKUew5Zr5DMshf8
327GcU26v5bEuO8TJfCJzLLflxQjwDJiliq110PI/5D8WEwsLFE+Lpsz9Sc8HNey
cYqN/xXVRIYqe+ZCI5beZQqhqCG6/qaJEQiuX4c0zc+nPW/Xk4ltbLhjoQIDAQAB
AoGBALR4IzLk6A+fBEqKuYTV0hCqtKq+yNV3HIkwy05tg+rEM9BRQ4d1XhEnHrl4
jKcMLLJHZwwRArodzmdZZqpxurppveQO86ZDAdNBbzbi+PwfevsJLIQvVquZ9aKo
HZEFCvQ6qpLYNp9LbnO0h6oYMxvLAfzk9k3XAy7mDCF+ZpLFAkEA+ShymJtcrqVk
Qq1Lh28oDRuFtgz0uQnCC8iqAfbtS4Jmmg/Xfv/ty6jww2wQBOp0+Pg1B8Utn/0Y
P5HPhxQzFwJBAMnw5AoX5NlPW5FU2py5eE/mrIkbibtVLNtDwZn/aTdvXAr+a7sH
29HlrYH0rm/krK/LTThSmr2RFGEsAhijsgcCQQC+oSG8fPHWdZhWI3ysLHG6RZpy
BUuf30Vl+quIQUKhCS4zJXe9JVbtAV7kReOjvzar3kvEnCoiRGSvDoJ3WQ8VAkAa
TJP2OIxmPK6JK8rYtFLV3Q3FQV/blMkluRpCiv/R51/OUroG/owDNu00yn/ZNKfE
sS5aUm+ylm1YBloziUYLAkB94l84bDDH+qtax+a/QLb57Oj0+RF0PZkjrFB1Pe7M
zaw6O3htXY4coKeZYKyW6P7SQl1YtKIFLSBPOXlj9foq
-----END RSA PRIVATE KEY-----
`;
    return jwt.sign(payload, key, {
      expiresIn: config.tokenExpiresIn,
      issuer: config.issuer,
      algorithm: 'RS256',
    });
  }

  private generatePasswordhash(password: string) {
    return bcrypt.hash(password, 8);
  }
}
