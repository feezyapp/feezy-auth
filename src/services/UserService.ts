import config from '../config';
import { Permission } from '../models/entities/Permission';
import { IClaims, IClaimsWithId, IUserDataWithClaim } from '../models/ITokenWithUser';
import { IUserToken } from '../models/IUserToken';
import { IUsersListRequest } from '../models/requests/IUsersListRequest';
import { IResetPasswordRequest, IUserUpdateRequest } from '../models/requests/IUserUpdateRequest';
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
    const { index = 1, size = 1000, role = 'all' } = body;
    const data = { role: role === 'all' ? undefined : role };
    const result = await this._requestHelper.requestWithAuthJson<IUserDataWithClaim, { role: string | undefined }>(
      `users/query?size=${size}&index=${index}`,
      data,
    );
    return this.transform(result, byUser);
  }

  async delete(userId: string, byUser?: IUserToken) {
    await this.authorize(Permission.delete, byUser);
    return this._requestHelper.deleteWithAuth<{ ok: true }>(`users/${userId}`);
  }

  async update(userId: string, body: IUserUpdateRequest, byUser?: IUserToken) {
    await this.authorize(Permission.edit, byUser);
    validators.validateUpdateUser(body);
    return this.updateClaims(userId, body);
  }

  async resetPassword(body: IResetPasswordRequest, byUser?: IUserToken) {
    await this.authorize(Permission.edit, byUser);
    validators.validateUserPassword(body);
    const { password, username, id } = body;
    const result = await this._requestHelper.requestWithAuthJson('users/reset_password', {
      login_id: config.tenantUserLogin,
      username,
      new_password: password,
    });
    if (byUser) await this.updateClaims(byUser.sub, { isPasswordChangeRequired: id ? true : false });
    return result;
  }

  async getById(userId: string, byUser?: IUserToken) {
    await this.authorize(Permission.view, byUser);
    const { id, claims } = await this._requestHelper.getWithAuth<IClaimsWithId>(`users/${userId}`);
    return {
      id,
      ...claims,
    };
  }

  private transform(usersObj: IUserDataWithClaim, byUser?: IUserToken): IUserListResponse {
    const { index, size, total, items } = usersObj;
    return {
      index,
      size,
      total,
      items: byUser
        ? items.filter(user => user._id !== byUser.sub).map(user => ({ id: user._id, ...user.claims }))
        : [],
    };
  }

  private updateClaims(userId: string, body: Partial<IClaims>) {
    return this._requestHelper.requestWithAuthJson<IClaimsWithId, { claims: Partial<IClaims> }>(
      `users/${userId}`,
      { claims: body },
      'PATCH',
    );
  }
}
