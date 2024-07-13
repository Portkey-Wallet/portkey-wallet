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

export type TFacebookUserInfo = {
  isExpired: boolean;
  userId: string;
  id: string;
  expirationTime: number;
  firstName: string;
  lastName?: string;
  picture?: string;
  email?: undefined;
  isPrivate: boolean;
  name: string;
  accessToken: string;
  idToken: string;
};

const fbUserInfo: { [key: string]: TFacebookUserInfo } = {};

export async function parseFacebookToken(tokenStr?: string | null): Promise<TFacebookUserInfo | undefined> {
  if (!tokenStr) return;
  try {
    const { userId, token: accessToken, expiredTime, idToken } = JSON.parse(tokenStr);

    const expirationTime = Number(expiredTime) * 1000;
    const isExpired = new Date(expirationTime) < new Date();

    if (!fbUserInfo[accessToken]) {
      const result = await customFetch(
        `https://graph.facebook.com/${userId}?fields=id,name,email,picture&access_token=${accessToken}`,
        {
          method: 'GET',
        },
      );
      const [firstName, lastName] = result?.name.split(' ');

      fbUserInfo[accessToken] = {
        userId,
        id: userId,
        name: result.name,
        isExpired,
        expirationTime,
        isPrivate: true,
        firstName,
        lastName,
        picture: result?.picture?.data?.url,
        accessToken: accessToken,
        idToken,
      };
    }

    return fbUserInfo[accessToken];
  } catch (error) {
    return;
  }
}

export function parseFacebookJWTToken(tokenStr?: string | null, accessToken?: string): TFacebookUserInfo | undefined {
  if (!tokenStr) return;
  const idTokenArr = tokenStr.split('.') ?? [];
  if (idTokenArr.length < 2) return;
  const spilt2 = Buffer.from(idTokenArr[1], 'base64').toString('utf8');
  const { sub: userId, name, family_name, given_name, exp: expirationTime, email, picture } = JSON.parse(spilt2) || {};
  const isExpired = new Date(expirationTime) < new Date();
  return {
    userId,
    id: userId,
    name: name,
    isExpired,
    expirationTime,
    isPrivate: true,
    firstName: given_name,
    lastName: family_name,
    picture,
    accessToken: accessToken,
    idToken: tokenStr,
  } as TFacebookUserInfo;
}

export interface TwitterUserInfo {
  isExpired: boolean;
  userId: string;
  id: string;
  expirationTime: number;
  firstName: string;
  lastName?: string;
  picture?: string;
  email?: undefined;
  isPrivate: boolean;
  name: string;
  accessToken: string;
  username?: string;
}

const XUserInfo: { [key: string]: TwitterUserInfo } = {};

export function parseTwitterToken(tokenStr?: string | null): TwitterUserInfo | undefined {
  if (!tokenStr) return;
  try {
    const { token: accessToken, id, name, username } = JSON.parse(tokenStr);
    const [firstName, lastName] = name.split(' ');

    let expirationTime = Date.now() + 60 * 60 * 1000;

    if (XUserInfo[accessToken]) expirationTime = XUserInfo[accessToken].expirationTime;
    const isExpired = new Date(expirationTime) < new Date();

    return {
      isExpired,
      userId: id,
      id,
      expirationTime,
      firstName: firstName,
      lastName: lastName,
      picture: undefined,
      email: undefined,
      isPrivate: true,
      name: name,
      accessToken,
      username,
    };
  } catch (error) {
    return;
  }
}

export function parseKidFromJWTToken(token: string) {
  const idTokenArr = token.split('.') ?? [];
  const spilt1 = Buffer.from(idTokenArr[0], 'base64').toString('utf8');
  const { kid } = JSON.parse(spilt1) || {};
  return kid;
}
