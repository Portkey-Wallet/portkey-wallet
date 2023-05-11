import * as AppleAuthentication from 'expo-apple-authentication';

const DefaultSignInOptions = {
  requestedScopes: [
    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    AppleAuthentication.AppleAuthenticationScope.EMAIL,
  ],
};

export async function signInAsync(
  options: AppleAuthentication.AppleAuthenticationSignInOptions = DefaultSignInOptions,
) {
  return AppleAuthentication.signInAsync(options);
}

export async function signOutAsync(options: AppleAuthentication.AppleAuthenticationSignOutOptions) {
  return AppleAuthentication.signOutAsync(options);
}
