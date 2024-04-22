import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { request } from '@portkey-wallet/api/api-did';
import { ChainId } from '@portkey-wallet/types';
import { removeManager } from '@portkey-wallet/utils/guardian';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { SendOptions } from '@portkey-wallet/contracts/types';
import { ACCOUNT_CANCELATION_ALERT_MAP } from '@portkey-wallet/constants/constants-ca/wallet';

// TODO: type change
export async function checkIsValidateDeletionAccount(type: string): Promise<string[]> {
  const req = await request.wallet.deletionCheckV2({
    params: { type },
  });
  const { validatedAssets, validatedDevice, validatedGuardian } = req || {};
  const list: string[] = [];
  if (!validatedAssets) list.push(ACCOUNT_CANCELATION_ALERT_MAP.Asset);
  if (!validatedGuardian) list.push(ACCOUNT_CANCELATION_ALERT_MAP.Guardian);
  if (!validatedDevice) list.push(ACCOUNT_CANCELATION_ALERT_MAP.LoginDevice);

  return list.length > 1 ? list.map((ele, index) => `${index + 1}. ${ele}`) : list;
}

export async function getSocialLoginAccountToken({
  currentLoginAccount,
  getAccountUserInfoFunc,
}: {
  currentLoginAccount: string;
  // todo: change type
  getAccountUserInfoFunc: () => Promise<any> | void;
}): Promise<string> {
  const userInfo = await getAccountUserInfoFunc();
  if (userInfo?.user?.id !== currentLoginAccount) {
    throw 'Account does not match';
  }
  return userInfo?.user?.id || '';
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
    type: string;
    chainId: ChainId;
    token: string;
    guardianIdentifier?: string;
    verifierSessionId?: string;
    verifierId: string;
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
