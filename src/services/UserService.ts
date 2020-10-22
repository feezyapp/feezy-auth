import { Permission } from '../models/entities/Permission';
import { IClaimsWithId, IUserDataWithClaim } from '../models/ITokenWithUser';
import { IUserToken } from '../models/IUserToken';
import { IUsersListRequest } from '../models/requests/IUsersListRequest';
import { IUserUpdateRequest } from '../models/requests/IUserUpdateRequest';
import { IUserListResponse } from '../models/response/IUserListResponse';
import { Role } from '../models/Role';
import RequestHelper from '../utils/requestHelper';
import validators from '../utils/validators';
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
    const result = await this._requestHelper.requestWithAuthJson<IUserDataWithClaim, { role: string | undefined }>(
      `/users/query?size=${size}&index=${index}`,
      data,
    );
    return this.transform(result, byUser);
  }

  async delete(userId: string, byUser?: IUserToken) {
    await this.authorize(Permission.delete, byUser);
    return this._requestHelper.deleteWithAuth<{ ok: true }>(`/users/${userId}`);
  }

  async update(userId: string, body: IUserUpdateRequest, byUser?: IUserToken) {
    await this.authorize(Permission.edit, byUser);
    validators.validateUpdateUser(body);
    return this._requestHelper.requestWithAuthJson<IClaimsWithId, { claims: IUserUpdateRequest }>(
      `/users/${userId}`,
      { claims: body },
      'PATCH',
    );
  }

  private transform(usersObj: IUserDataWithClaim, byUser?: IUserToken): IUserListResponse {
    const { index, size, total, items } = usersObj;
    return {
      index,
      size,
      total,
      items: byUser
        ? items.filter(user => user._id !== byUser.sub).map(user => ({ _id: user._id, ...user.claims }))
        : [],
    };
  }
}
