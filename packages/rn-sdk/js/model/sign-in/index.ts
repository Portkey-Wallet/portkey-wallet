import { NetworkController } from 'network/controller';

export const attemptAccountCheck = async (accountIdentifier: string): Promise<AccountCheckResult> => {
  const registerResultDTO = await NetworkController.getRegisterResult(accountIdentifier);
  if (registerResultDTO?.result) {
    const { originChainId } = registerResultDTO.result;
    const guardianResultDTO = await NetworkController.getAccountIdentifierResult(originChainId, accountIdentifier);
    return {
      hasRegistered: guardianResultDTO?.guardianList?.guardians?.length > 0,
    };
  } else if (registerResultDTO?.errCode === '3002') {
    return {
      hasRegistered: false,
    };
  } else {
    throw new Error('network failure');
  }
};

export interface AccountCheckResult {
  hasRegistered: boolean;
}
