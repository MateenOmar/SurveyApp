export interface UserForRegister {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  admin?: boolean;
}

export interface UserForLogin {
  username: string;
  password: string;
  token: string;
}
