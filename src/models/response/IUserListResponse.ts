import { IUserFromClaims } from '../ITokenWithUser';

export interface IUserListResponse {
  index: number;
  size: number;
  total: number;
  items: IUserFromClaims[];
}
