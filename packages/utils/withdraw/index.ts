import { eTransferCore } from '@etransfer/core';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { getWallet } from '../aelf';
import { IBlockchainWallet } from '@portkey/types';
import { PortkeyVersion } from '@etransfer/types';
import AElf from 'aelf-sdk';
import { ICrossTransfer, ICrossTransferInitOption, IWithdrawParams, IWithdrawPreviewParams } from './types';
import { ZERO } from '@portkey-wallet/constants/misc';
import { timesDecimals } from '../converter';
import { handleErrorMessage, sleep } from '../index';
import { isAuthTokenError } from '@etransfer/services';
import { LocalStorageKey } from '@etransfer/core';
import { removeDIDAddressSuffix } from '@etransfer/utils';

export const CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL = ['ELF', 'USDT'];

class CrossTransfer implements ICrossTransfer {
  options: ICrossTransferInitOption;
  authTokenCount = 0;
  constructor() {
    this.options = {} as any;
  }
  init(options: ICrossTransferInitOption) {
    this.options = options;
    const eTransferUrl = this.options.eTransferUrl;
    eTransferCore.init({ etransferUrl: eTransferUrl, etransferAuthUrl: eTransferUrl, storage: this.options.storage });
  }

  formatAuthTokenParams = () => {
    const { walletInfo, pin } = this.options;
    const caHash = walletInfo.caHash;
    if (!caHash) throw new Error('Can not get user caHash');
    if (!pin) throw new Error('Locked');

    const aesPrivateKey = AElf.wallet.AESDecrypt(walletInfo.AESEncryptPrivateKey, pin);
    console.log(aesPrivateKey, 'aesPrivateKey==');
    const manager = getWallet(aesPrivateKey) as IBlockchainWallet;
    const plainTextOrigin = `Nonce:${Date.now()}`;
    const plainTextHex = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
    const plainTextHexSignature = Buffer.from(plainTextHex).toString('hex');

    const signature = AElf.wallet.sign(plainTextHexSignature, manager.keyPair).toString('hex');
    const pubkey = manager.keyPair.getPublic('hex');
    const managerAddress = manager.address;

    console.log(manager, 'manager===');

    return {
      pubkey,
      signature,
      plainText: plainTextHex,
      caHash,
      managerAddress,
      version: PortkeyVersion.v2,
    };
  };

  checkAllowanceAndApprove = async ({
    tokenContract,
    portkeyContract,
    symbol,
    spender,
    owner,
    amount,
    caHash,
  }: {
    tokenContract: ContractBasic;
    portkeyContract: ContractBasic;
    symbol: string;
    spender: string;
    owner: string;
    amount: string;
    caHash: string;
  }) => {
    console.log(tokenContract, symbol, spender, owner);
    const [allowance, info] = await Promise.all([
      tokenContract.callViewMethod('GetAllowance', { symbol, owner, spender }),
      tokenContract.callViewMethod('GetTokenInfo', { symbol }),
    ]);
    console.log(allowance, info, '===allowance, info');
    if (allowance?.error) throw allowance?.error;
    if (info?.error) throw info?.error;
    const allowanceBN = ZERO.plus(allowance.data.allowance ?? allowance.data.amount ?? 0);
    const pivotBalanceBN = timesDecimals(amount, info.data.decimals ?? 8);
    if (allowanceBN.lt(pivotBalanceBN)) {
      const approveResult = await portkeyContract.callSendMethod('ManagerApprove', '', {
        caHash,
        spender,
        symbol,
        amount: pivotBalanceBN.toFixed(),
      });
      if (approveResult?.error) throw approveResult?.error;
      return true;
    }
    return true;
  };

  withdraw: ICrossTransfer['withdraw'] = async (params: IWithdrawParams) => {
    try {
      const { tokenContract, chainId, toAddress, amount, tokenInfo, portkeyContract } = params;
      const arr = toAddress.split('_');
      const toChainId = arr[arr.length - 1];
      const { pin, walletInfo, chainList, eTransferCA } = this.options;
      const chainInfo = chainList.find(item => item.chainId === chainId);
      if (!pin) throw new Error('No Pin');
      if (!CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(tokenInfo.symbol))
        throw new Error(`Not support: ${tokenInfo.symbol}`);
      const caAddress = walletInfo.caAddress;
      const eTransferContractAddress = eTransferCA?.[chainId];

      if (!chainInfo) throw new Error('Can not get chainInfo');
      if (!caAddress) throw new Error('Can not get caAddress');
      if (!eTransferContractAddress) throw new Error('Please eTransferContractAddress!');

      const aesPrivateKey = AElf.wallet.AESDecrypt(walletInfo.AESEncryptPrivateKey, pin);
      const manager = getWallet(aesPrivateKey) as IBlockchainWallet;

      const managerAddress = manager.address;
      const authParams = this.formatAuthTokenParams();
      const caHash = walletInfo.caHash;
      if (!caHash) throw new Error('Can not get user caHash');
      const authToken = await eTransferCore.getAuthToken({ ...authParams, chainId });
      console.log(authToken, 'authToken===');
      await this.checkAllowanceAndApprove({
        tokenContract,
        symbol: tokenInfo.symbol,
        spender: eTransferContractAddress,
        owner: caAddress,
        caHash,
        amount,
        portkeyContract,
      });

      const result = await eTransferCore.withdrawOrder({
        endPoint: chainInfo.endPoint,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        amount,
        toAddress,
        caContractAddress: chainInfo.caContractAddress,
        eTransferContractAddress,
        caHash,
        network: toChainId,
        chainId,
        managerAddress,
        getSignature: async ser => {
          const signObj = manager.keyPair.sign(AElf.utils.sha256(ser));
          return {
            signature: [
              signObj.r.toString('hex', 32),
              signObj.s.toString('hex', 32),
              `0${signObj.recoveryParam?.toString()}`,
            ].join(''),
          } as any;
        },
      });

      return result;
    } catch (error) {
      console.log(handleErrorMessage(error), 'withdrawPreview==error');
      if (this.authTokenCount > 5) throw error;
      if (isAuthTokenError(error)) {
        this.authTokenCount++;
        await this.options.storage?.removeItem(LocalStorageKey.ETRANSFER_ACCESS_TOKEN);
        await sleep(1000);
        return this.withdraw(params);
      }
      throw error;
    }
  };

  withdrawPreview: ICrossTransfer['withdrawPreview'] = async (params: IWithdrawPreviewParams) => {
    try {
      const { chainId, address, symbol, amount } = params;
      const arr = address.split('_');
      const toChainId = arr[arr.length - 1];

      const authParams = this.formatAuthTokenParams();
      await eTransferCore.getAuthToken({ chainId, ...authParams });
      const result = await eTransferCore.services.getWithdrawInfo({
        chainId: chainId,
        network: toChainId,
        symbol,
        amount,
        address: removeDIDAddressSuffix(address) || undefined,
        version: PortkeyVersion.v2,
      });
      this.authTokenCount = 0;

      return result;
    } catch (error: any) {
      console.log(handleErrorMessage(error), 'withdrawPreview==error');
      if (isAuthTokenError(error)) {
        this.authTokenCount++;
        if (this.authTokenCount > 5) throw error;

        await this.options.storage?.removeItem(LocalStorageKey.ETRANSFER_ACCESS_TOKEN);
        await sleep(1000);

        return this.withdrawPreview(params);
      }
      throw error;
    }
  };
}

export default CrossTransfer;
