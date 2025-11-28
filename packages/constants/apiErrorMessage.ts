export const VerifyErrorMessage = {
  '20001': 'Unsupported Type',
  '20002': 'Input is null or empty',
  '20003': 'LoginGuardianType is not match the VerifierSessionId',
  '20004': 'Invalid email input',
  '20005': 'Too Many Retries',
  '20006': 'The code is invalid, please resend later',
  '20007': 'The code has expired. Please resend the code.',
  '20008': 'Already Verified',
  '20009': 'There is no such entity',
};

export const isVerifyApiError = (err: any) => {
  const code = err?.error?.code || err?.code;
  if (!code) return false;
  const isError = VerifyErrorMessage[code as keyof typeof VerifyErrorMessage];
  if (isError) return isError;
  return false;
};
