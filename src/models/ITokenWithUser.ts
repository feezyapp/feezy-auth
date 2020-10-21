export interface ITokenWithUser {
  id?: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: IClaims;
}

export interface IClaims {
  name: string;
  email: string;
  role: string;
  key: string;
  username: string;
  id?: string;
  _id?: string;
  status: string;
  department: string;
  isApproved: boolean;
  isPasswordChangeRequired: boolean;
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
