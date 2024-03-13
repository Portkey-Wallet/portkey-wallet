export interface ThirdPartyAccountInfo {
  google?: GoogleAccountInfo;
  apple?: AppleAccountInfo;
}

export interface GoogleAccountInfo {
  accessToken: string;
  accountIdentifier: string;
}

export interface AppleAccountInfo {
  identityToken: string;
  accountIdentifier: string;
}

export const isAppleLogin = (account: GoogleAccountInfo | AppleAccountInfo): account is AppleAccountInfo => {
  return !!(account as AppleAccountInfo).identityToken;
};

export const handleGoogleLogin = async (): Promise<GoogleAccountInfo> => {
  throw new Error('Not implemented');
};

export const handleAppleLogin = async (): Promise<AppleAccountInfo> => {
  throw new Error('Not implemented');
};
