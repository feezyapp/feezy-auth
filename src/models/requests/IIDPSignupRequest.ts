import { Role } from '../Role';

export interface IIDPSignupRequest {
  claims: ISignupClaims;
  logins: {
    [key: string]: {
      type: string;
      key: string;
      password: string;
    };
  };
}

export interface ISignupClaims {
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
  status: string;
  contact: string;
  password: string;
  username: string;
}
