import { Role } from './Role';

export interface ITokenWithUser {
  id?: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: IClaims;
}

export interface IClaims {
  firstname: string;
  email: string;
  role: Role;
  lastname: string;
  username: string;
  _id: string;
  status: string;
  contact: string;
  password: string;
}

export interface IUserFromClaims {
  username: string;
  name: string;
  key: string;
  role: string;
  email: string;
  status: string;
  department: string;
  isApproved: boolean;
}

export interface IUserDataWithClaim {
  index: number;
  size: number;
  total: number;
  items: IClaimsWithId[];
}

export interface IClaimsWithId {
  id?: string;
  _id?: string;
  claims: IClaims;
}
