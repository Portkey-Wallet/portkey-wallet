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
    caHash?: string;
  },
) {
  const caHash = extra?.caHash;
  const manager = extra?.verifyManagerAddress;
  if (operationType === OperationTypeEnum.register || operationType === OperationTypeEnum.communityRecovery) {
    return JSON.stringify({ manager, caHash });
  }
  // if (!guardian) return '{}';
  if (
    operationType === OperationTypeEnum.addGuardian ||
    operationType === OperationTypeEnum.deleteGuardian ||
    operationType === OperationTypeEnum.setLoginAccount ||
    operationType === OperationTypeEnum.unsetLoginAccount
  ) {
    const { identifierHash, guardianType, verifierId } = extra || {};
    return JSON.stringify({
      identifierHash,
      guardianType: getGuardianTypeValue(guardianType),
      verifierId,
      caHash,
      manager,
    });
  }
  if (operationType === OperationTypeEnum.editGuardian) {
    const { identifierHash, guardianType } = extra || {};
    const { preVerifierId, newVerifierId } = extra || {};
    return JSON.stringify({
      identifierHash,
      guardianType: getGuardianTypeValue(guardianType),
      preVerifierId,
      newVerifierId,
      caHash,
      manager,
    });
  }
  if (operationType === OperationTypeEnum.transferApprove) {
    const { symbol, amount, toAddress } = extra || {};
    return JSON.stringify({ symbol, amount, toAddress, caHash, manager, managerAddress: manager });
  }
  if (operationType === OperationTypeEnum.managerApprove) {
    const { spender, amount, symbol } = extra || {};
    return JSON.stringify({ spender, symbol, amount, caHash, manager });
  }
  if (operationType === OperationTypeEnum.modifyTransferLimit) {
    const { symbol, singleLimit, dailyLimit } = extra || {};
    return JSON.stringify({ symbol, singleLimit, dailyLimit, caHash, manager });
  }
  return JSON.stringify({ caHash, manager });
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
  }
  return 0;
}
