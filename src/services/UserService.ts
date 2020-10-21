import { Permission } from '../models/entities/Permission';
import { IUserDataWithClaim } from '../models/ITokenWithUser';
import { IUserToken } from '../models/IUserToken';
import { IUsersListRequest } from '../models/requests/IUsersListRequest';
import { Role } from '../models/Role';
import RequestHelper from '../utils/requestHelper';
import { BaseService } from './BaseService';
// import loggerFactory from '../utils/logging';
// const logger = loggerFactory.getLogger('UserService');

export class UserService extends BaseService {
  constructor(protected _requestHelper: RequestHelper) {
    super();
  }

  async get(body: IUsersListRequest, byUser?: IUserToken) {
    await this.authorize(Permission.view, byUser);
    const { index = 1, size = 1000, all = 'all' } = body;
    const data = { role: all ? undefined : Role.employee };
    return this._requestHelper.postWithAuthJson<IUserDataWithClaim, { role: string | undefined }>(
      `/users/query?size=${size}&index=${index}`,
      data,
    );
  }
}
