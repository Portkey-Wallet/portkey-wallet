import { eTransferCore } from '@etransfer/core';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { getWallet } from '../aelf';
import { IBlockchainWallet } from '@portkey/types';
import { PortkeyVersion } from '@etransfer/types';
import AElf from 'aelf-sdk';
import { ICrossTransfer, ICrossTransferInitOption, IWithdrawParams, IWithdrawPreviewParams } from './types';

export const CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL = ['ELF', 'USDT'];

class CrossTransfer implements ICrossTransfer {
  options: ICrossTransferInitOption;

  constructor() {
    this.options = {} as any;
  }
  init(options: ICrossTransferInitOption) {
    this.options = options;
    const eTransferUrl = this.options.eTransferUrl;
    eTransferCore.init({ etransferUrl: eTransferUrl, etransferAuthUrl: eTransferUrl });
  }

  formatAuthTokenParams() {
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
  }

  checkAllowanceAndApprove({
    tokenContract,
    symbol,
    spender,
    owner,
  }: {
    tokenContract: ContractBasic;
    symbol: string;
    spender: string;
    owner: string;
  }) {
    console.log(tokenContract, symbol, spender, owner);
    // const [allowance, info] = await Promise.all([
    //   tokenContract.callViewMethod('GetAllowance', { symbol, owner, spender }),
    //   tokenContract.callViewMethod('GetTokenInfo', { symbol }),
    // ]);
    // console.log(allowance, info, '===allowance, info');
    // if (allowance?.error) throw allowance?.error;
    // if (info?.error) throw info?.error;
    // const allowanceBN = ZERO.plus(allowance.data.allowance ?? allowance.data.amount ?? 0);
    // const pivotBalanceBN = contractUseAmount
    //   ? ZERO.plus(contractUseAmount)
    //   : timesDecimals(pivotBalance, info.data.decimals ?? 8);
    // if (allowanceBN.lt(pivotBalanceBN)) {
    //   const approveResult = await tokenContract.callSendMethod('approve', '', [
    //     approveTargetAddress,
    //     symbol,
    //     LANG_MAX.toFixed(0),
    //   ]);
    //   console.log(approveResult, '===approveResult');
    //   if (approveResult?.error) throw approveResult?.error;
    //   return approveResult;
    // }
  }

  async withdraw({ tokenContract, chainId, toAddress, amount, tokenInfo }: IWithdrawParams) {
    const { pin, walletInfo, chainInfo, eTransferCA } = this.options;
    if (!pin) throw new Error('No Pin');
    if (!CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(tokenInfo.symbol))
      throw new Error(`Not support: ${tokenInfo.symbol}`);
    const caAddress = walletInfo.caAddress;
    const eTransferContractAddress = eTransferCA?.[chainId];

    if (!chainInfo) throw new Error('Can not get chainInfo');
    if (!caAddress) throw new Error('Can not get caAddress');
    if (!eTransferContractAddress) throw new Error('Please eTransferContractAddress!');

    const aesPrivateKey = walletInfo.AESEncryptPrivateKey;
    const manager = getWallet(aesPrivateKey) as IBlockchainWallet;

    const managerAddress = manager.address;
    const authParams = this.formatAuthTokenParams();
    console.log(authParams, 'authToken===authParams');

    const authToken = await eTransferCore.getAuthToken({ ...authParams, chainId });
    console.log(authToken, 'authToken===');
    await this.checkAllowanceAndApprove({
      tokenContract,
      symbol: tokenInfo.symbol,
      spender: eTransferContractAddress,
      owner: caAddress,
    });

    const caHash = walletInfo.caHash;
    if (!caHash) throw new Error('Can not get user caHash');

    const result = await eTransferCore.withdrawOrder({
      endPoint: chainInfo.endPoint,
      symbol: tokenInfo.symbol,
      decimals: tokenInfo.decimals,
      amount,
      toAddress,
      caContractAddress: chainInfo.caContractAddress,
      eTransferContractAddress,
      caHash,
      network: 'AELF',
      chainId,
      managerAddress,
      getSignature: async (ser: any) => {
        return manager.keyPair.sign(AElf.utils.sha256(Buffer.from(ser, 'hex')), {
          canonical: true,
        });
      },
    });
    console.log(result, 'result===');
    return result;
  }

  async withdrawPreview({ chainId, address, symbol, amount }: IWithdrawPreviewParams) {
    const authParams = this.formatAuthTokenParams();
    await eTransferCore.getAuthToken({ chainId, ...authParams });
    return eTransferCore.services.getWithdrawInfo({
      chainId: chainId,
      network: 'AELF',
      symbol,
      amount,
      address: address || undefined,
      version: PortkeyVersion.v2,
    });
  }
}

export default CrossTransfer;
