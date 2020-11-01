import { Role } from '../Role';

export interface IUserUpdateRequest {
  name: string;
  email: string;
  role: Role;
  department: string;
}

export interface IResetPasswordRequest {
  password: string;
  username: string;
  id?: string;
}
