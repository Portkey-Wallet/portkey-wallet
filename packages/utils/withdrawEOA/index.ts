import { eTransferCore } from '@etransfer/core';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { getWallet } from '../aelf';
import { IBlockchainWallet } from '@portkey/types';
import { PortkeyVersion, TWalletType, AuthTokenSource } from '@etransfer/types';
import AElf from 'aelf-sdk';
import { ICrossTransfer, ICrossTransferInitOption, IWithdrawParams, IWithdrawPreviewParams } from './types';
import { ZERO } from '@portkey-wallet/constants/misc';
import { timesDecimals } from '../converter';
import { handleErrorMessage, sleep } from '../index';
import { isAuthTokenError } from '@etransfer/utils';
import { LocalStorageKey } from '@etransfer/utils';
import { removeDIDAddressSuffix } from '@etransfer/utils';

export const CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL = ['ELF', 'USDT'];
const ETRANSFER_VERSION = '2.13.0';

class CrossTransfer implements ICrossTransfer {
  options: ICrossTransferInitOption;
  authTokenCount = 0;
  constructor() {
    this.options = {} as any;
  }
  init(options: ICrossTransferInitOption) {
    this.options = options;
    const eTransferUrl = this.options.eTransferUrl;
    eTransferCore.init({
      etransferUrl: eTransferUrl,
      etransferAuthUrl: eTransferUrl,
      storage: this.options.storage,
      version: ETRANSFER_VERSION,
    });
  }

  formatAuthTokenParams = () => {
    const { account, pin } = this.options;
    console.log('===', pin);
    if (!pin) throw new Error('Locked');

    const aesPrivateKey = AElf.wallet.AESDecrypt(account.AESEncryptPrivateKey, pin);
    console.log(aesPrivateKey, 'aesPrivateKey==');
    const wallet = getWallet(aesPrivateKey) as IBlockchainWallet;
    const plainTextOrigin = `Nonce:${Date.now()}`;
    const plainTextHex = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
    const plainTextHexSignature = Buffer.from(plainTextHex).toString('hex');

    const signature = AElf.wallet.sign(plainTextHexSignature, wallet.keyPair).toString('hex');
    const pubkey = wallet.keyPair.getPublic('hex');
    const managerAddress = wallet.address;

    console.log(wallet, 'manager===');

    return {
      pubkey,
      signature,
      plainText: plainTextHex,
      managerAddress,
      version: PortkeyVersion.v2,
      source: AuthTokenSource.NightElf,
    };
  };

  checkAllowanceAndApprove = async ({
    tokenContract,
    symbol,
    spender,
    owner,
    amount,
  }: {
    tokenContract: ContractBasic;
    symbol: string;
    spender: string;
    owner: string;
    amount: string;
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
      const approveResult = await tokenContract.callSendMethod('approve', owner, {
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
      const { tokenContract, chainId, toAddress, amount, tokenInfo, network, isCheckSymbol = true } = params;
      const { pin, account, chainList, eTransferCA } = this.options;
      const chainInfo = chainList.find(item => item.chainId === chainId);
      if (!pin) throw new Error('No Pin');
      // todo: change it
      if (isCheckSymbol && !CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(tokenInfo.symbol))
        throw new Error(`Not support: ${tokenInfo.symbol}`);
      const eTransferContractAddress = eTransferCA?.[chainId];

      if (!tokenContract) throw new Error('no tokenContract');
      if (!chainInfo) throw new Error('Can not get chainInfo');
      if (!eTransferContractAddress) throw new Error('Please eTransferContractAddress!');

      const authParams = this.formatAuthTokenParams();

      const authToken = await eTransferCore.getAuthToken({ ...authParams, chainId });

      console.log(authToken, 'authToken===');

      console.log('withdrawOrder params', {
        walletType: TWalletType.NightElf,
        endPoint: chainInfo.endPoint,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        amount,
        toAddress,
        caHash: '',
        caContractAddress: '',
        eTransferContractAddress,
        network,
        chainId,
        managerAddress: account.address || '',
      });

      await this.checkAllowanceAndApprove({
        tokenContract,
        symbol: tokenInfo.symbol,
        spender: eTransferContractAddress,
        owner: account.address,
        amount,
      });

      const result = await eTransferCore.withdrawOrder({
        walletType: TWalletType.NightElf,
        endPoint: chainInfo.endPoint,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        amount,
        toAddress,
        caHash: '',
        caContractAddress: '',
        eTransferContractAddress,
        network,
        chainId,
        managerAddress: account.address || '',
        getSignature: async ser => {
          const aesPrivateKey = AElf.wallet.AESDecrypt(account.AESEncryptPrivateKey, pin);
          const wallet = getWallet(aesPrivateKey) as IBlockchainWallet;
          const signObj = wallet.keyPair.sign(AElf.utils.sha256(ser));
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
      console.log(handleErrorMessage(error), 'withdraw==error');
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
      const { chainId, address, symbol, amount, network, currentAccountAddress, isMainnet } = params;
      const authParams = this.formatAuthTokenParams();

      const isRegistered = await eTransferCore.services.checkEOARegistration({
        address: currentAccountAddress,
      });

      console.log('isRegistered', isRegistered);

      const recaptchaToken = isRegistered?.result
        ? undefined
        : (((await this.options.verifyHumanMachine?.('en', true, isMainnet)) || '') as string);

      const aToken = await eTransferCore.getAuthToken({
        ...authParams,
        source: AuthTokenSource.NightElf,
        recaptchaToken,
      });

      console.log('aToken', aToken);
      const result = await eTransferCore.services.getWithdrawInfo({
        chainId: chainId,
        network,
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
