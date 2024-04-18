import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { request } from '@portkey-wallet/api/api-did';
import { ChainId } from '@portkey-wallet/types';
import { removeManager } from '@portkey-wallet/utils/guardian';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { SendOptions } from '@portkey-wallet/contracts/types';
import { ACCOUNT_CANCELATION_ALERT_MAP } from '@portkey-wallet/constants/constants-ca/wallet';

// TODO: type change
export async function checkIsValidateDeletionAccount(): Promise<string[]> {
  const req = await request.wallet.deletionCheck();
  const { validatedAssets, validatedDevice, validatedGuardian } = req || {};
  const list: string[] = [];
  if (!validatedAssets) list.push(ACCOUNT_CANCELATION_ALERT_MAP.Asset);
  if (!validatedDevice) list.push(ACCOUNT_CANCELATION_ALERT_MAP['Login Device']);
  if (!validatedGuardian) list.push(ACCOUNT_CANCELATION_ALERT_MAP.Guardian);
  return list;
}

export async function getSocialLoginAccountToken({
  currentLoginAccount,
  getAccountUserInfoFunc,
}: {
  currentLoginAccount: string;
  // todo: change type
  getAccountUserInfoFunc: () => Promise<any>;
}) {
  const userInfo = await getAccountUserInfoFunc();
  if (userInfo?.user?.id !== currentLoginAccount) {
    throw 'Account does not match';
  }
  return userInfo?.user?.id;
}

export async function sendRevokeVerifyCodeAsync(params: {
  guardianIdentifier: string;
  chainId: string;
  type: keyof typeof LoginType;
}) {
  return request.wallet.sendRevokeVerifyCode({ params });
}

export async function deleteLoginAccount({
  removeManagerParams,
  deleteParams,
}: {
  removeManagerParams: {
    caContract: ContractBasic;
    managerAddress: string;
    caHash: string;
    // TODO: change
    sendOptions?: SendOptions;
  };
  deleteParams: {
    type: keyof typeof LoginType;
    chainId: ChainId;
    token: string;
    guardianIdentifier?: string;
    verifierSessionId?: string;
    verifierId?: string;
  };
}) {
  const { caContract, managerAddress, caHash, sendOptions } = removeManagerParams;
  const req = await removeManager(caContract, managerAddress, caHash, sendOptions);
  if (req.error) throw req?.error;

  try {
    await request.wallet.deletionAccountV2({ params: deleteParams });
  } catch (error) {
    console.log(error);
  }
}
