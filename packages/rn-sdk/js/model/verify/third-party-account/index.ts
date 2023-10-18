export interface ThirdPartyAccountInfo {
  google?: GoogleAccountInfo;
  apple?: AppleAccountInfo;
}

export interface GoogleAccountInfo {
  accessToken: string;
}

export interface AppleAccountInfo {
  identityToken: string;
}

// export const handleGoogleLogin = () => {};
