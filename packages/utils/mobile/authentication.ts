import {
  authenticateAsync,
  isEnrolledAsync,
  LocalAuthenticationResult,
  hasHardwareAsync,
} from 'expo-local-authentication';

/* Biometrics */
export async function touchAuth(): Promise<LocalAuthenticationResult> {
  const options = {
    hintMessage: 'Verify your identity',
    fallbackLabel: 'Use password',
    promptMessage: 'AELF identity authentication',
  };
  const enrolled = await authenticationReady();
  if (enrolled !== true) {
    return {
      error: 'enrolled error',
      success: false,
    };
  }
  return await authenticateAsync(options);
}

export async function authenticationReady() {
  return isEnrolledAsync();
}

export const hasHardware = hasHardwareAsync;
