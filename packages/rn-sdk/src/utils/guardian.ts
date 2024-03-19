import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { VerifierInfo } from '@portkey-wallet/types/verifier';
import { GuardiansStatus } from 'pages/Guardian/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { handleVerificationDoc } from '@portkey-wallet/utils/guardian';

const getGuardiansApproved = (userGuardiansList: UserGuardianItem[], guardiansStatus: GuardiansStatus) => {
  return userGuardiansList
    .map(guardian => {
      if (!guardiansStatus[guardian.key] || !guardiansStatus[guardian.key].verifierInfo) return null;
      const verificationDoc = guardiansStatus[guardian.key].verifierInfo?.verificationDoc || '';
      const { guardianIdentifier } = handleVerificationDoc(verificationDoc);
      return {
        identifierHash: guardianIdentifier,
        type: guardian.guardianType,
        verificationInfo: {
          id: guardian.verifier?.id,
          signature: Object.values(Buffer.from(guardiansStatus[guardian.key].verifierInfo?.signature as any, 'hex')),
          verificationDoc,
        },
      };
    })
    .filter(item => item !== null);
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
  const { guardianIdentifier } = handleVerificationDoc(verifierInfo.verificationDoc);
  const guardianToAdd = {
    identifierHash: guardianIdentifier,
    type: guardianItem.guardianType,
    verificationInfo: {
      id: guardianItem.verifier?.id,
      signature: Object.values(Buffer.from(verifierInfo.signature as any, 'hex')),
      verificationDoc: verifierInfo.verificationDoc,
    },
  };
  const guardiansApproved = getGuardiansApproved(userGuardiansList, guardiansStatus);
  return contract?.callSendMethod('AddGuardian', address, {
    caHash,
    guardianToAdd: guardianToAdd,
    guardiansApproved: guardiansApproved,
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
  guardianItem: UserGuardianItem,
) {
  return contract?.callSendMethod('SetGuardianForLogin', address, {
    caHash,
    guardian: {
      type: guardianItem.guardianType,
      verifierId: guardianItem.verifier?.id,
      identifierHash: guardianItem.identifierHash,
    },
  });
}

export function cancelLoginAccount(
  contract: ContractBasic,
  address: string,
  caHash: string,
  guardianItem: UserGuardianItem,
) {
  return contract?.callSendMethod('UnsetGuardianForLogin', address, {
    caHash,
    guardian: {
      type: guardianItem.guardianType,
      verifierId: guardianItem.verifier?.id,
      identifierHash: guardianItem.identifierHash,
    },
  });
}

// no call
// export function removeManager(contract: ContractBasic, address: string, caHash: string) {
//   return contract?.callSendMethod('RemoveManagerInfo', address, {
//     caHash,
//     managerInfo: {
//       address,
//       extraData: Date.now(),
//     },
//   });
// }

// export function encodedDeletionManager(contract: ContractBasic, address: string, caHash: string) {
//   return contract?.encodedTx('RemoveManagerInfo', {
//     caHash,
//     managerInfo: {
//       address,
//       extraData: Date.now(),
//     },
//   });
// }

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
