import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId, ChainType } from '@portkey-wallet/types';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { formatChainInfoToShow, handleErrorMessage } from '@portkey-wallet/utils';
import aes from '@portkey-wallet/utils/aes';
import { Button, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import usePromptSearch from 'hooks/usePromptSearch';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUserInfo, useWalletInfo } from 'store/Provider/hooks';
import errorHandler from 'utils/errorHandler';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import { callSendMethod } from 'utils/sandboxUtil/sendTransactions';
import { useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import getTransferFee from './utils/getTransferFee';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import './index.less';

export default function SendTransactions() {
  const { payload } = usePromptSearch<{
    payload: {
      chainId: ChainId;
      contractAddress: string;
      method: string;
      params: any;
    };
  }>();
  const chainInfo = useCurrentChain(payload?.chainId);
  const wallet = useCurrentWalletInfo();
  const { walletName } = useWalletInfo();
  const { currentNetwork } = useWalletInfo();
  const isMainnet = useIsMainnet();
  const { t } = useTranslation();
  const { passwordSeed } = useUserInfo();
  const amountInUsdShow = useAmountInUsdShow();
  const [fee, setFee] = useState('');
  const isCAManagerForwardCall = useMemo(
    () => chainInfo?.caContractAddress !== payload?.contractAddress,
    [chainInfo, payload],
  );
  const privateKey = useMemo(
    () => aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed),
    [passwordSeed, wallet.AESEncryptPrivateKey],
  );

  const getFee = useCallback(async () => {
    let paramsOption = {};
    if (isCAManagerForwardCall) {
      paramsOption = {
        caHash: wallet.caHash,
        contractAddress: payload?.contractAddress,
        methodName: payload?.method,
        args: payload?.params?.paramsOption,
      };
    } else {
      paramsOption = {
        caHash: wallet.caHash,
        ...payload?.params?.paramsOption,
      };
    }
    try {
      const params = {
        isCAManagerForwardCall,
        contractAddress: payload?.contractAddress,
        privateKey: privateKey as string,
        chainInfo: chainInfo as ChainItemType,
        chainType: 'aelf' as ChainType,
        paramsOption,
      };
      const fee = await getTransferFee(params);
      setFee(fee);
    } catch (error) {
      console.log('get fee error', error);
    }
  }, [chainInfo, isCAManagerForwardCall, payload, privateKey, wallet]);

  useEffect(() => {
    getFee();
  }, [getFee]);

  const renderAccountInfo = useMemo(
    () =>
      payload?.contractAddress ? (
        <div className="account flex">
          <div className="name">{walletName}</div>
          <CustomSvg type="Oval" />
          <div className="address">{`${payload?.contractAddress.slice(0, 10)}...${payload?.contractAddress.slice(
            -4,
          )}`}</div>
          <div className="line" />
        </div>
      ) : (
        <></>
      ),
    [payload, walletName],
  );

  // Transfer
  const renderDetail = useMemo(() => {
    const { symbol, amount, decimals } = payload?.params?.paramsOption || {};
    return (
      <div className="detail">
        <div className="title">Details</div>
        <div className="amount">
          <div className="title">Amount</div>
          <div className="amount-number flex-between">
            <div>{`${formatAmountShow(amount)} ELF`}</div>
            {isMainnet && <div>{amountInUsdShow(amount, decimals, symbol)}</div>}
          </div>
        </div>
        <div className="fee flex-between">
          <div>Transaction Fee</div>
          <div className="fee-amount">
            <div className="elf">{`${formatAmountShow(amount)} ELF`}</div>
            {isMainnet && <div>{amountInUsdShow(amount, decimals, symbol)}</div>}
          </div>
        </div>
        <div className="total flex-between">
          <div>Total (Amount + Transaction Fee)</div>
          <div className="total-amount">
            <div className="elf">{`${formatAmountShow(ZERO.plus(amount).plus(fee))} ELF`}</div>
            {isMainnet && <div>{amountInUsdShow(amount, decimals, symbol)}</div>}
          </div>
        </div>
      </div>
    );
  }, [amountInUsdShow, fee, isMainnet, payload?.params?.paramsOption]);

  const renderMessage = useMemo(() => {
    const params = payload?.params?.paramsOption || {};
    return (
      <div className="message-wrapper">
        <div className="title">Message</div>
        <div className="message">
          {Object.keys(params).map((item) => (
            <>
              <div className="title">{item}</div>
              <div className="content">{params[item]}</div>
            </>
          ))}
        </div>
        <div className="fee flex-between">
          <div>Transaction Fee</div>
          <div className="fee-amount">
            <div className="elf">{`${formatAmountShow(fee)} ELF`}</div>
            {isMainnet && <div>{amountInUsdShow(fee, 0, 'ELF')}</div>}
          </div>
        </div>
      </div>
    );
  }, [amountInUsdShow, fee, isMainnet, payload?.params?.paramsOption]);

  const sendHandler = useCallback(async () => {
    try {
      if (!chainInfo?.endPoint || !wallet?.caHash) {
        closePrompt({ ...errorHandler(400001), data: { code: 4002, msg: 'invalid chain id' } });
        return;
      }
      let paramsOption = payload?.params?.paramsOption;

      const functionName = isCAManagerForwardCall ? 'ManagerForwardCall' : payload?.method;

      paramsOption = isCAManagerForwardCall
        ? {
            caHash: wallet.caHash,
            methodName: payload?.method,
            contractAddress: payload?.contractAddress,
            args: paramsOption,
          }
        : paramsOption;
      if (!privateKey) throw 'Invalid user information, please check';
      const result = await callSendMethod({
        rpcUrl: chainInfo.endPoint,
        chainType: 'aelf',
        methodName: functionName,
        paramsOption,
        privateKey,
        address: chainInfo.caContractAddress,
        sendOptions: { onMethod: 'transactionHash' },
      });
      closePrompt({
        ...errorHandler(0),
        data: result.result,
      });
    } catch (error) {
      console.error(error, 'error===detail');
      message.error(handleErrorMessage(error));
    }
  }, [chainInfo, wallet, payload, isCAManagerForwardCall, privateKey]);

  return (
    <div className="send-transaction flex">
      <div className="chain flex-center">
        <CustomSvg type={isMainnet ? 'Aelf' : 'elf-icon'} />
        <span>{formatChainInfoToShow(payload?.chainId, currentNetwork)}</span>
      </div>
      {renderAccountInfo}
      <div className="method">
        <div className="title">Method</div>
        <div className="method-name">{payload?.method}</div>
      </div>
      {payload?.method.toLowerCase() === 'transfer' ? renderDetail : renderMessage}
      <div className="btn flex-between">
        <Button
          type="text"
          onClick={() => {
            closePrompt(errorHandler(200003));
          }}>
          {t('Reject')}
        </Button>
        <Button type="primary" onClick={sendHandler}>
          {t('Sign')}
        </Button>
      </div>
    </div>
  );
}
