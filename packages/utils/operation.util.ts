import { OperationTypeEnum } from '@portkey-wallet/types/verifier';

export function getOperationDetails(
  operationType: OperationTypeEnum,
  extra?: {
    identifierHash?: string;
    guardianType?: string;
    verifierId?: string;
    preVerifierId?: string;
    newVerifierId?: string;
    symbol?: string;
    amount?: string | number;
    toAddress?: string;
    singleLimit?: string;
    dailyLimit?: string;
    spender?: string;
    verifyManagerAddress?: string;
  },
) {
  if (operationType === OperationTypeEnum.register || operationType === OperationTypeEnum.communityRecovery) {
    return JSON.stringify({ manager: extra?.verifyManagerAddress });
  }
  // if (!guardian) return '{}';
  if (
    operationType === OperationTypeEnum.addGuardian ||
    operationType === OperationTypeEnum.deleteGuardian ||
    operationType === OperationTypeEnum.setLoginAccount ||
    operationType === OperationTypeEnum.unsetLoginAccount
  ) {
    const { identifierHash, guardianType, verifierId } = extra || {};
    return JSON.stringify({ identifierHash, guardianType: getGuardianTypeValue(guardianType), verifierId });
  }
  if (operationType === OperationTypeEnum.editGuardian) {
    const { identifierHash, guardianType } = extra || {};
    const { preVerifierId, newVerifierId } = extra || {};
    return JSON.stringify({
      identifierHash,
      guardianType: getGuardianTypeValue(guardianType),
      preVerifierId,
      newVerifierId,
    });
  }
  if (operationType === OperationTypeEnum.transferApprove) {
    const { symbol, amount, toAddress } = extra || {};
    return JSON.stringify({ symbol, amount, toAddress });
  }
  if (operationType === OperationTypeEnum.managerApprove) {
    const { spender, amount, symbol } = extra || {};
    return JSON.stringify({ spender, symbol, amount });
  }
  if (operationType === OperationTypeEnum.modifyTransferLimit) {
    const { symbol, singleLimit, dailyLimit } = extra || {};
    return JSON.stringify({ symbol, singleLimit, dailyLimit });
  }
  return '{}';
}
function getGuardianTypeValue(guardianType?: string) {
  if (guardianType === 'Email') {
    return 0;
  } else if (guardianType === 'Google') {
    return 2;
  } else if (guardianType === 'Apple') {
    return 3;
  } else if (guardianType === 'Telegram') {
    return 4;
  } else if (guardianType === 'Facebook') {
    return 5;
  } else if (guardianType === 'Twitter') {
    return 6;
  } else {
    return guardianType;
  }
}
