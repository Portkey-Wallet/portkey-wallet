import { ZERO } from '@portkey-wallet/constants/misc';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { GuardiansInfo } from '@portkey-wallet/types/types-ca/guardian';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import {
  VerifierItem,
  VerifierInfo,
  ZKLoginInfo,
  ZKLoginInfoInContract,
  ZKLoginInfoNoncePayload,
} from '@portkey-wallet/types/verifier';
import BigNumber from 'bignumber.js';
import { handleErrorMessage } from '.';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { SendOptions } from '@portkey-wallet/contracts/types';
import { parseJWTToken, parseZKProof } from './authentication';

const APPROVAL_COUNT = ZERO.plus(3).div(5);
export function getApprovalCount(length: number) {
  if (length <= 3) return length;
  return APPROVAL_COUNT.times(length).dp(0, BigNumber.ROUND_DOWN).plus(1).toNumber();
}

export function handleZKLoginInfo(zkLoginInfo?: ZKLoginInfo) {
  if (zkLoginInfo) {
    const {
      identifierHash,
      salt,
      zkProof,
      jwt,
      nonce,
      circuitId,
      poseidonIdentifierHash,
      identifierHashType,
      timestamp,
      managerAddress,
    } = zkLoginInfo;
    const { kid, issuer } = parseJWTToken(jwt);
    const zkProofInfo = parseZKProof(zkProof);
    const noncePayload: ZKLoginInfoNoncePayload = {
      addManagerAddress: {
        timestamp: { seconds: timestamp },
        managerAddress,
      },
    };
    return {
      identifierHash,
      salt,
      zkProof,
      kid,
      issuer,
      nonce,
      circuitId,
      zkProofInfo,
      noncePayload,
      poseidonIdentifierHash,
      identifierHashType,
    } as ZKLoginInfoInContract;
  }
  return {} as ZKLoginInfoInContract;
}

export function handleVerifierInfo(verifierInfo?: VerifierInfo) {
  if (!verifierInfo) return { identifierHash: '' };
  if (verifierInfo.zkLoginInfo) {
    const identifierHash = verifierInfo.zkLoginInfo.identifierHash;
    return { identifierHash };
  } else {
    const { guardianIdentifier } = handleVerificationDoc(verifierInfo.verificationDoc ?? '');
    return { identifierHash: guardianIdentifier };
  }
}

export function handleVerificationDoc(verificationDoc: string) {
  const [type, guardianIdentifier, verificationTime, verifierAddress, salt] = verificationDoc.split(',');
  return { type, guardianIdentifier, verificationTime, verifierAddress, salt };
}

export function handleUserGuardiansList(
  holderInfo: GuardiansInfo,
  verifierServers: VerifierItem[] | { [key: string]: VerifierItem },
) {
  const { guardianList } = holderInfo;
  return guardianList.guardians.map(item => {
    return {
      ...item,
      guardianAccount: item.guardianIdentifier || item.identifierHash,
      guardianType: LoginType[item.type as any] as unknown as LoginType,
      key: `${item.guardianIdentifier}&${item.verifierId}`,
      verifier: Array.isArray(verifierServers)
        ? verifierServers.find(verifierItem => verifierItem.id === item.verifierId)
        : verifierServers[item.verifierId],
      isLoginAccount: item.isLoginGuardian,
    };
  });
}

export function checkIsLastLoginAccount(guardiansList: UserGuardianItem[], guardian: UserGuardianItem) {
  const loginIndex = guardiansList.findIndex(
    item =>
      item.isLoginAccount &&
      !(
        item.guardianType === guardian.guardianType &&
        item.guardianAccount === guardian.guardianAccount &&
        item.verifier?.id === guardian.verifier?.id
      ),
  );
  return loginIndex === -1;
}

export function checkVerifierIsInvalidCode(error: any) {
  const text = handleErrorMessage(error);
  return !!text?.includes('Invalid code');
}

export function removeManager(contract: ContractBasic, address: string, caHash: string, sendOptions?: SendOptions) {
  return contract?.callSendMethod(
    'RemoveManagerInfo',
    address,
    {
      caHash,
      managerInfo: {
        address,
        extraData: Date.now(),
      },
    },
    sendOptions,
  );
}
