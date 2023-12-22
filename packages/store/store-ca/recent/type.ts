export interface loginInfo {
  account: string;
  accountType?: 'phone' | 'email';
  loginType?: 'register' | 'login';
}

export interface LoginState {
  loginAccount?: loginInfo;
}
