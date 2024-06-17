import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import NftInput from './NftInput';
import TokenInput from './TokenInput';
import { IWithdrawPreviewParams } from '@portkey-wallet/utils/withdraw/types';
import { TGetWithdrawInfoResult } from '@etransfer/services';

export default function AmountInput({
  fromAccount,
  type = 'token',
  toAccount,
  value,
  token,
  errorMsg,
  onChange,
  getTranslationInfo,
  getEtransferwithdrawInfo,
  setErrorMsg,
}: {
  fromAccount: { address: string; AESEncryptPrivateKey: string };
  type: 'token' | 'nft';
  toAccount: { address: string };
  value: string;
  token: BaseToken;
  errorMsg: string;
  onChange: (params: { amount: string; balance: string }) => void;
  getTranslationInfo: (num: string) => any;
  getEtransferwithdrawInfo: (params: IWithdrawPreviewParams) => Promise<TGetWithdrawInfoResult>;
  setErrorMsg: (v: string) => void;
}) {
  return type === 'token' ? (
    <TokenInput
      fromAccount={fromAccount}
      toAccount={toAccount}
      value={value}
      token={token}
      errorMsg={errorMsg}
      onChange={onChange}
      getTranslationInfo={getTranslationInfo}
      getEtransferwithdrawInfo={getEtransferwithdrawInfo}
      setErrorMsg={setErrorMsg}
    />
  ) : (
    <NftInput fromAccount={fromAccount} value={value} token={token} errorMsg={errorMsg} onChange={onChange} />
  );
}
