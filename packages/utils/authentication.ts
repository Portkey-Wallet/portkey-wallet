import { customFetch } from './fetch';

export type AppleUserInfo = {
  isExpired: boolean;
  userId: string;
  email: string;
  expirationTime: Date;
  isPrivate: boolean;
};

export function parseAppleIdentityToken(identityToken?: string | null): AppleUserInfo | undefined {
  if (!identityToken) return;
  const parts = identityToken.split('.');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  const expirationTime = new Date(payload.exp * 1000);
  const isExpired = expirationTime < new Date();
  const userId = payload.sub;
  const email = payload.email;
  const isPrivate =
    typeof payload.is_private_email === 'string'
      ? payload.is_private_email === 'true'
      : payload.is_private_email || !payload.email;
  return { isExpired, userId, email, expirationTime, isPrivate };
}

type GoogleUserInfo = {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  userId: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
  firstName: string;
  lastName: string;
};

const TmpUserInfo: { [key: string]: GoogleUserInfo } = {};

export async function getGoogleUserInfo(accessToken = ''): Promise<GoogleUserInfo> {
  if (!TmpUserInfo[accessToken])
    TmpUserInfo[accessToken] = await customFetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

  return {
    ...TmpUserInfo[accessToken],
    userId: TmpUserInfo[accessToken].id,
    firstName: TmpUserInfo[accessToken].given_name,
    lastName: TmpUserInfo[accessToken].family_name,
  };
}

export interface TelegramUserInfo {
  isExpired: boolean;
  userId: string;
  id: string;
  expirationTime: number;
  firstName: string;
  givenName: string;
  lastName?: string;
  picture?: string;
  email?: undefined;
}

export function parseTelegramToken(token?: string | null): TelegramUserInfo | undefined {
  if (!token) return;
  const parts = token.split('.');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  const expirationTime = payload.exp * 1000;
  const isExpired = new Date(expirationTime) < new Date();
  const userId = payload.userId;
  const firstName = payload.firstName;
  const givenName = payload.firstName;
  const picture = payload.protoUrl;
  const lastName = payload.lastName;
  return { isExpired, userId, expirationTime, firstName, picture, lastName, id: userId, givenName };
}
