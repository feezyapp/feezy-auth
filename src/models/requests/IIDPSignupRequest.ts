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
  name: string;
  email: string;
  role: string;
  username: string;
  status: string;
  department: string;
  isPasswordChangeRequired: boolean;
}
