import config from '../config';
import { AppError } from '../exceptions/AppError';
import { IIDPLoginRequest } from '../models/requests/IIDPLoginRequest';
import { ISignupClaims } from '../models/requests/IIDPSignupRequest';
import { ILoginRequest } from '../models/requests/ILoginRequest';
import { ISignupRequest } from '../models/requests/ISignupRequest';
import { Role } from '../models/Role';
import { Status } from '../models/Status';
import { UserAccountRepository } from '../repositories/UserAccounts';
import loggerFactory from '../utils/logging';
import validators from '../utils/validators';
import { BaseService } from './BaseService';
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
    const request = {
      grant_type: 'password',
      client_id: config.clientId,
      username,
      password,
      scope: 'openid',
    };
    return this.getToken(request);
  }

  async signup(body: ISignupRequest) {
    validators.validateCreateUser(body);
    const { firstname, email, lastname, password, contact } = body;
    const _signupRequest: ISignupClaims = {
      firstname,
      lastname,
      email,
      status: Status.active,
      role: Role.staff,
      contact,
      password,
      username: email,
    };

    try {
      const result = await this.userAccountRepo.save(_signupRequest);
      return result;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err && err.code === 11000) {
        throw new AppError('Email exists', 'Entered email has already been taken');
      } else throw err;
    }
  }

  private getToken(requestBody: IIDPLoginRequest) {
    try {
      logger.info(requestBody);
      return Promise.resolve('ok');
    } catch (err) {
      throw new AppError('Invalid Credentials', 'You have entered an invalid username or password', 401);
    }
  }
}
