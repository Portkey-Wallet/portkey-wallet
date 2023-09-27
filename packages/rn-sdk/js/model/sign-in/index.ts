export const attemptAccountCheck = async (accountIdentifier: string): Promise<AccountCheckResult> => {
  throw new Error('Not implemented');
};

export interface AccountCheckResult {
  hasRegistered: boolean;
}
