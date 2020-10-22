import config from '../config';
import { AppError } from '../exceptions/AppError';
import { IClaimsWithId, ITokenWithUser } from '../models/ITokenWithUser';
import { IIDPLoginRequest } from '../models/requests/IIDPLoginRequest';
import { IIDPSignupRequest, ISignupClaims } from '../models/requests/IIDPSignupRequest';
import { ILoginRequest } from '../models/requests/ILoginRequest';
import { ISignupRequest } from '../models/requests/ISignupRequest';
import { Role } from '../models/Role';
import { Status } from '../models/Status';
import loggerFactory from '../utils/logging';
import RequestHelper from '../utils/requestHelper';
import validators from '../utils/validators';
import { BaseService } from './BaseService';
const logger = loggerFactory.getLogger('AuthService');

export class AuthService extends BaseService {
  constructor(protected _requestHelper: RequestHelper) {
    super();
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
    const { name, email, role, department, password, username } = body;
    const _signupRequest: ISignupClaims = {
      name,
      email,
      status: Status.active,
      role: role || Role.admin,
      department,
      isPasswordChangeRequired: true,
      username,
    };

    const jsonBody: IIDPSignupRequest = {
      claims: _signupRequest,
      logins: {
        [config.tenantUserLogin]: {
          type: 'password',
          key: username,
          password,
        },
      },
    };
    try {
      const result = await this._requestHelper.requestWithAuthJson<IClaimsWithId, IIDPSignupRequest>('/users', jsonBody);
      logger.info('signup success: ->>', JSON.stringify(result));
      return this.login({ username, password });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err && err.error === 'username_taken') {
        throw new AppError('Username exists', 'Entered username has already been taken');
      } else throw err;
    }
  }

  private async getToken(requestBody: IIDPLoginRequest) {
    try {
      return await this._requestHelper.postWithAuthFormData<ITokenWithUser, IIDPLoginRequest>('/token', requestBody);
    } catch (err) {
      throw new AppError('Invalid Credentials', 'You have entered an invalid username or password', 401);
    }
  }
}
