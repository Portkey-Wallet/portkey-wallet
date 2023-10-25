import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import { ZERO } from '@portkey-wallet/constants/misc';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainType } from '@portkey-wallet/types';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { isCrossChain } from '@portkey-wallet/utils/aelf';
import { divDecimalsStr, timesDecimals } from '@portkey-wallet/utils/converter';
import { getTxFee } from 'store/utils/getStore';
import { getBalance } from 'utils/sandboxUtil/getBalance';
import getTransactionFee from 'utils/sandboxUtil/getTransactionFee';

const getTransferFee = async ({
  managerAddress,
  toAddress,
  privateKey,
  chainInfo,
  chainType,
  token,
  caHash,
  amount,
  memo = '',
}: {
  managerAddress: string;
  chainInfo: ChainItemType;
  chainType: ChainType;
  privateKey: string;
  toAddress: string;
  token: BaseToken;
  caHash: string;
  amount: number | string;
  memo?: string;
}) => {
  const { crossChain: crossChainFee } = getTxFee(token.chainId);

  if (isCrossChain(toAddress, chainInfo?.chainId ?? 'AELF')) {
    // first
    const firstTxResult = await getTransactionFee({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo?.endPoint || '',
      chainType,
      methodName: 'ManagerTransfer',
      privateKey,
      paramsOption: {
        caHash,
        symbol: token.symbol,
        to: managerAddress,
        amount,
        memo,
      },
    });
    let _firstFee = firstTxResult.result['ELF'];
    if (token.symbol !== DEFAULT_TOKEN.symbol) {
      const managerBalance = await getBalance({
        rpcUrl: chainInfo.endPoint,
        address: token.address,
        chainType: 'aelf',
        paramsOption: {
          symbol: DEFAULT_TOKEN.symbol,
          owner: managerAddress,
        },
      });

      const balance = managerBalance.result.balance;
      const crossChainAmount = timesDecimals(crossChainFee, DEFAULT_TOKEN.decimals);

      if (crossChainAmount.gt(balance)) {
        const firstTxResult = await getTransactionFee({
          contractAddress: chainInfo.caContractAddress,
          rpcUrl: chainInfo?.endPoint || '',
          chainType,
          methodName: 'ManagerTransfer',
          privateKey,
          paramsOption: {
            caHash,
            symbol: 'ELF',
            to: managerAddress,
            amount: crossChainAmount.toFixed(0),
            memo,
          },
        });
        const crossELFFee = firstTxResult.result['ELF'];
        _firstFee = ZERO.plus(_firstFee).plus(crossELFFee);
      }
    }

    const firstFee = divDecimalsStr(_firstFee, DEFAULT_TOKEN.decimals);
    console.log(firstTxResult, 'transactionRes===cross');
    if (Number.isNaN(ZERO.plus(firstFee).toNumber())) {
      return '0';
    } else {
      return firstFee;
    }
  } else {
    const transactionRes = await getTransactionFee({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo?.endPoint || '',
      chainType,
      methodName: 'ManagerForwardCall',
      privateKey,
      paramsOption: {
        caHash,
        contractAddress: token.address,
        methodName: 'Transfer',
        args: {
          symbol: token.symbol,
          to: toAddress,
          amount,
          memo,
        },
      },
    });
    console.log(transactionRes, 'transactionRes===');
    const feeRes = transactionRes.result['ELF'];
    return divDecimalsStr(feeRes, DEFAULT_TOKEN.decimals);
  }
};

export default getTransferFee;
