import { Role } from '../Role';

export interface IUserUpdateRequest {
  name: string;
  email: string;
  role: Role;
  department: string;
}
