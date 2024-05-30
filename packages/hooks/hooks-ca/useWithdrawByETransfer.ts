import { eTransferCore } from '@etransfer/core';
import { IBlockchainWallet } from '@portkey/types';
import { useCurrentNetworkInfo } from './network';
import { useCallback, useEffect, useMemo } from 'react';
import { useCurrentWallet } from './wallet';
import AElf from 'aelf-sdk';
import { ChainId } from '@portkey-wallet/types';
import { getWallet } from '@portkey-wallet/utils/aelf';
import { PortkeyVersion } from '@etransfer/types';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
// import { CallContractParams, removeDIDAddressSuffix } from '@etransfer/utils';
import { useCurrentChainList } from './chainList';
// import { SendOptions } from '@portkey-wallet/contracts/types';
// import { ZERO } from '@portkey-wallet/constants/misc';
// import { timesDecimals } from '@portkey-wallet/utils/converter';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL = ['ELF', 'USDT'];

export const useWithdrawByETransfer = (pin?: string) => {
  const { eTransferUrl, eTransferCA } = useCurrentNetworkInfo();
  const wallet = useCurrentWallet();
  const currentChainList = useCurrentChainList();
  useEffect(() => {
    eTransferCore.init({ etransferUrl: eTransferUrl, etransferAuthUrl: eTransferUrl });
  }, [eTransferUrl]);

  const formatAuthTokenParams = useCallback(() => {
    const caHash = wallet.walletInfo.caHash;
    if (!caHash) throw new Error('Can not get user caHash');
    if (!pin) throw new Error('Locked');

    const aesPrivateKey = AElf.wallet.AESDecrypt(wallet.walletInfo.AESEncryptPrivateKey, pin);
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
  }, [pin, wallet.walletInfo.AESEncryptPrivateKey, wallet.walletInfo.caHash]);

  const checkAllowanceAndApprove = useCallback(
    async ({
      tokenContract,
      symbol,
      spender,
      owner,
    }: {
      tokenContract: ContractBasic;
      symbol: string;
      spender: string;
      owner: string;
    }) => {
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
    },
    [],
  );

  const withdraw = useCallback(
    async ({
      tokenContract,
      chainId,
      toAddress,
      amount,
      tokenInfo,
    }: {
      chainId: ChainId;
      tokenContract: ContractBasic;
      toAddress: string;
      amount: string;
      tokenInfo: {
        address: string;
        symbol: string;
        decimals: number;
      };
    }) => {
      if (!pin) return;
      if (!CROSS_CHAIN_ETRANSFER_SUPPORT_SYMBOL.includes(tokenInfo.symbol))
        throw new Error(`Not support: ${tokenInfo.symbol}`);
      const chainInfo = currentChainList?.find(chain => chain.chainId === chainId);
      const caAddress = wallet.walletInfo.caAddress;
      const eTransferContractAddress = eTransferCA?.[chainId];

      if (!chainInfo) throw new Error('Can not get chainInfo');
      if (!caAddress) throw new Error('Can not get caAddress');
      if (!eTransferContractAddress) throw new Error('Please eTransferContractAddress!');

      const aesPrivateKey = wallet.walletInfo.AESEncryptPrivateKey;
      const manager = getWallet(aesPrivateKey) as IBlockchainWallet;

      const managerAddress = manager.address;
      const authParams = formatAuthTokenParams();
      console.log(authParams, 'authToken===authParams');

      const authToken = await eTransferCore.getAuthToken({ ...authParams, chainId });
      console.log(authToken, 'authToken===');
      await checkAllowanceAndApprove({
        tokenContract,
        symbol: tokenInfo.symbol,
        spender: eTransferContractAddress,
        owner: caAddress,
      });

      const caHash = wallet.walletInfo.caHash;
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
    },
    [
      checkAllowanceAndApprove,
      currentChainList,
      eTransferCA,
      formatAuthTokenParams,
      pin,
      wallet.walletInfo.AESEncryptPrivateKey,
      wallet.walletInfo.caAddress,
      wallet.walletInfo.caHash,
    ],
  );

  const withdrawPreview = useCallback(
    async ({
      chainId,
      address,
      symbol,
      amount,
    }: {
      chainId: ChainId;
      address: string;
      symbol: string;
      amount: string;
    }) => {
      const authParams = formatAuthTokenParams();
      console.log(authParams, await chrome.storage.local.get('etransfer_access_token'), 'authToken===authParams');
      console.log(symbol, 'symbol==withdrawPreview');
      await eTransferCore.getAuthToken({ chainId, ...authParams });
      return eTransferCore.services.getWithdrawInfo({
        chainId: chainId,
        network: 'AELF',
        symbol,
        amount,
        address: address || undefined,
        version: PortkeyVersion.v2,
      });
    },
    [formatAuthTokenParams],
  );

  return useMemo(() => ({ withdraw, withdrawPreview }), [withdraw, withdrawPreview]);
};

// export const useWithdrawTransferByMobile = (pin?: string) => {
//   useEffect(() => {
//     eTransferCore.init({ storage: AsyncStorage });
//   }, []);

//   return useWithdrawByETransfer(pin);
// };
