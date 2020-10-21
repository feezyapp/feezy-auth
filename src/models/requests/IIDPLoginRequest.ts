export interface IIDPLoginRequest {
  grant_type: string;
  client_id: string;
  username: string;
  password: string;
  scope: string;
}
