import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { VerifierInfo } from '@portkey-wallet/types/verifier';
import { GuardiansApproved, GuardiansStatus } from 'pages/Guardian/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { handleVerifierInfo, handleZKLoginInfo } from '@portkey-wallet/utils/guardian';
import { ITransferLimitItem } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { GuardiansApprovedType } from '@portkey-wallet/types/types-ca/guardian';

export const getGuardiansApproved = (
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
): GuardiansApprovedType[] => {
  return userGuardiansList
    .filter(item => guardiansStatus[item.key] && guardiansStatus[item.key].verifierInfo)
    .map(guardian => {
      const verificationDoc = guardiansStatus[guardian.key].verifierInfo?.verificationDoc || '';
      // const { identifierHash } = handleVerifierInfo(guardiansStatus[guardian.key].verifierInfo); // todo_wade: confirm this
      const signature = guardiansStatus[guardian.key].verifierInfo?.signature
        ? Object.values(Buffer.from(guardiansStatus[guardian.key].verifierInfo?.signature as any, 'hex'))
        : [];
      return {
        identifierHash: guardian.identifierHash,
        type: guardian.guardianType,
        verificationInfo: {
          id: guardian.verifier?.id,
          signature,
          verificationDoc,
        },
        zkLoginInfo: handleZKLoginInfo(guardiansStatus[guardian.key].verifierInfo?.zkLoginInfo),
      };
    });
};

export const getGuardiansApprovedByApprove = (guardiansApprove: GuardiansApproved) => {
  return guardiansApprove.map(item => {
    const { guardianIdentifier } = handleVerificationDoc(item.verificationDoc);
    return {
      identifierHash: guardianIdentifier,
      type: item.guardianType,
      verificationInfo: {
        id: item.verifierId,
        signature: Object.values(Buffer.from(item.signature, 'hex')),
        verificationDoc: item.verificationDoc,
      },
    };
  });
};

export function deleteGuardian(
  contract: ContractBasic,
  address: string,
  caHash: string,
  guardianItem: UserGuardianItem,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
) {
  const guardianToRemove = {
    identifierHash: guardianItem.identifierHash,
    type: guardianItem.guardianType,
    verificationInfo: {
      id: guardianItem.verifier?.id,
    },
  };
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('RemoveGuardian', address, {
    caHash,
    guardianToRemove,
    guardiansApproved: guardiansApproved,
  });
}

export function addGuardian(
  contract: ContractBasic,
  address: string,
  caHash: string,
  verifierInfo: VerifierInfo,
  guardianItem: UserGuardianItem,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
) {
  const { identifierHash } = handleVerifierInfo(verifierInfo);
  const guardianToAdd = {
    identifierHash,
    type: guardianItem.guardianType,
    verificationInfo: {
      id: guardianItem.verifier?.id,
      signature: verifierInfo.signature ? Object.values(Buffer.from(verifierInfo.signature as any, 'hex')) : [],
      verificationDoc: verifierInfo.verificationDoc,
    },
    zkLoginInfo: handleZKLoginInfo(verifierInfo.zkLoginInfo),
  };
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('AddGuardian', address, {
    caHash,
    guardianToAdd: guardianToAdd,
    guardiansApproved: guardiansApproved,
    pass: true, // todo_wade: confirm
  });
}

export function editGuardian(
  contract: ContractBasic,
  address: string,
  caHash: string,
  preGuardianItem: UserGuardianItem,
  guardianItem: UserGuardianItem,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
) {
  const guardianToUpdatePre = {
    identifierHash: preGuardianItem.identifierHash,
    type: preGuardianItem.guardianType,
    verificationInfo: {
      id: preGuardianItem.verifier?.id,
    },
  };
  const guardianToUpdateNew = {
    identifierHash: preGuardianItem.identifierHash,
    type: guardianItem.guardianType,
    verificationInfo: {
      id: guardianItem.verifier?.id,
    },
  };
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('UpdateGuardian', address, {
    caHash,
    guardianToUpdatePre,
    guardianToUpdateNew,
    guardiansApproved: guardiansApproved,
  });
}

export function setLoginAccount(
  contract: ContractBasic,
  address: string,
  caHash: string,
  verifierInfo: VerifierInfo,
  guardianItem: UserGuardianItem,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
) {
  const guardian = {
    identifierHash: guardianItem.identifierHash,
    type: guardianItem.guardianType,
    verificationInfo: {
      id: guardianItem.verifier?.id,
      signature: Object.values(Buffer.from(verifierInfo.signature as any, 'hex')),
      verificationDoc: verifierInfo.verificationDoc,
    },
  };
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('SetGuardianForLogin', address, {
    caHash,
    guardianToSetLogin: guardian,
    guardiansApproved: guardiansApproved,
  });
}

export function unsetLoginAccount(
  contract: ContractBasic,
  address: string,
  caHash: string,
  verifierInfo: VerifierInfo,
  guardianItem: UserGuardianItem,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
) {
  const guardian = {
    identifierHash: guardianItem.identifierHash,
    type: guardianItem.guardianType,
    verificationInfo: {
      id: guardianItem.verifier?.id,
      signature: Object.values(Buffer.from(verifierInfo.signature as any, 'hex')),
      verificationDoc: verifierInfo.verificationDoc,
    },
  };
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('UnsetGuardianForLogin', address, {
    caHash,
    guardianToUnsetLogin: guardian,
    guardiansApproved: guardiansApproved,
  });
}

export function encodedDeletionManager(contract: ContractBasic, address: string, caHash: string) {
  return contract?.encodedTx('RemoveManagerInfo', {
    caHash,
    managerInfo: {
      address,
      extraData: Date.now(),
    },
  });
}

export function removeOtherManager(
  contract: ContractBasic,
  address: string,
  caHash: string,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
) {
  const managerInfo = {
    address,
    extraData: Date.now(),
  };
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('RemoveOtherManagerInfo', address, {
    caHash,
    managerInfo,
    guardiansApproved: guardiansApproved,
  });
}

export function modifyTransferLimit(
  contract: ContractBasic,
  address: string,
  caHash: string,
  userGuardiansList: UserGuardianItem[],
  guardiansStatus: GuardiansStatus,
  transferLimitDetail: ITransferLimitItem,
) {
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('SetTransferLimit', address, {
    caHash,
    symbol: transferLimitDetail.symbol,
    guardiansApproved: guardiansApproved,
    singleLimit: transferLimitDetail.singleLimit,
    dailyLimit: transferLimitDetail.dailyLimit,
  });
}
