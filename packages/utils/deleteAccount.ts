import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { request } from '@portkey-wallet/api/api-did';
import { ChainId } from '@portkey-wallet/types';
import { removeManager } from '@portkey-wallet/utils/guardian';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { SendOptions } from '@portkey-wallet/contracts/types';

const AlertMap = {
  Asset:
    'There are remaining assets in your account. To proceed, please first transfer all assets out of your account.',
  Guardian: `Your Apple ID is set as a guardian by other accounts. To proceed, please first remove your Apple ID's linked guardian.`,
  'Login Device':
    'Your account is logged in on other devices. To proceed, please first log out there or remove the login device.',
};

// TODO: type change
export async function checkIsValidateDeletionAccount(): Promise<string[]> {
  const req = await request.wallet.deletionCheck();
  const { validatedAssets, validatedDevice, validatedGuardian } = req || {};
  const list: string[] = [];
  if (!validatedAssets) list.push(AlertMap.Asset);
  if (!validatedDevice) list.push(AlertMap['Login Device']);
  if (!validatedGuardian) list.push(AlertMap.Guardian);
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
  await request.wallet.sendRevokeVerifyCode({ params });
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
