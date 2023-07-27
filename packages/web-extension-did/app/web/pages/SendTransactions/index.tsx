import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
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
import { useAmountInUsdShow, useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import getTransferFee from './utils/getTransferFee';
import { ResponseCode } from '@portkey/provider-types';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import { useCheckManagerSyncState } from 'hooks/wallet';
import CircleLoading from 'components/CircleLoading';
import { request } from '@portkey-wallet/api/api-did';
import clsx from 'clsx';
import './index.less';

export default function SendTransactions() {
  const { payload, transactionInfoId } = usePromptSearch<{
    payload: {
      chainId: ChainId;
      contractAddress: string;
      method: string;
      rpcUrl: string;
    };
    transactionInfoId: string;
  }>();
  const chainInfo = useCurrentChain(payload?.chainId);
  const wallet = useCurrentWalletInfo();
  const { walletName } = useWalletInfo();
  const { currentNetwork } = useWalletInfo();
  const isMainnet = useIsMainnet();
  const { t } = useTranslation();
  const { passwordSeed } = useUserInfo();
  const amountInUsdShow = useAmountInUsdShow();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, getTokenPrice, getTokensPrice] = useGetCurrentAccountTokenPrice();
  const [fee, setFee] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokenDecimals, setTokenDecimals] = useState(0);
  const defaultToken = useDefaultToken(payload?.chainId);
  const isCAContract = useMemo(() => chainInfo?.caContractAddress === payload?.contractAddress, [chainInfo, payload]);
  const privateKey = useMemo(
    () => aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed),
    [passwordSeed, wallet.AESEncryptPrivateKey],
  );
  const [txParams, setTxParams] = useState<any>({});
  const checkManagerSyncState = useCheckManagerSyncState();
  const [isManagerSynced, setIsManagerSynced] = useState(false);

  const formatAmountInUsdShow = useCallback(
    (amount: string | number, decimals: string | number, symbol: string) => {
      const value = amountInUsdShow(amount, decimals, symbol);
      if (symbol === defaultToken.symbol) {
        return value === '$ 0' ? '<$ 0.01' : value;
      } else {
        return value;
      }
    },
    [amountInUsdShow, defaultToken.symbol],
  );

  const getFee = useCallback(
    async (txInfo: any) => {
      if (!privateKey) return;
      if (!chainInfo?.endPoint || !wallet?.caHash || !chainInfo.caContractAddress) return;
      const method = isCAContract ? payload?.method : 'ManagerForwardCall';
      const paramsOption = isCAContract
        ? txInfo.paramsOption
        : {
            caHash: wallet.caHash,
            methodName: payload?.method,
            contractAddress: payload?.contractAddress,
            args: txInfo.paramsOption,
          };
      const fee = await getTransferFee({
        rpcUrl: chainInfo.endPoint,
        chainType: 'aelf',
        methodName: method,
        paramsOption,
        privateKey,
        contractAddress: chainInfo.caContractAddress,
      });
      if (fee === '--') {
        setFee('0');
        setErrMsg('Failed to estimate transaction fee');
      } else {
        setFee(fee);
        setErrMsg('');
      }
    },
    [chainInfo, isCAContract, payload, privateKey, wallet],
  );

  const getTokenDecimals = useCallback(async (token: string, chainId: ChainId) => {
    try {
      const tokenDetail = await request.token.fetchTokenItemBySearch({
        params: {
          symbol: token,
          chainId,
        },
      });
      setTokenDecimals(tokenDetail?.decimals ?? 0);
    } catch (err) {
      console.log('get token decimals error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTxPayload = useCallback(async () => {
    const txPayload = await getLocalStorage<{ [x: string]: any }>('txPayload');

    if (!txPayload[transactionInfoId]) {
      closePrompt({
        ...errorHandler(400001),
        data: { code: ResponseCode.ERROR_IN_PARAMS },
      });
      return;
    }
    const params = JSON.parse(txPayload[transactionInfoId]);
    getTokenDecimals(params?.paramsOption?.symbol, payload?.chainId);
    setTxParams(params);
    const _isManagerSynced = await checkManagerSyncState(payload?.chainId);
    setIsManagerSynced(_isManagerSynced);
    if (_isManagerSynced) {
      getFee(params);
      setErrMsg('');
    } else {
      setErrMsg('Synchronizing on-chain account information...');
    }
  }, [checkManagerSyncState, getFee, getTokenDecimals, payload?.chainId, transactionInfoId]);

  useEffect(() => {
    getTxPayload();
  }, [getTxPayload]);

  useEffect(() => {
    const symbol = txParams.paramsOption?.symbol;
    if (!symbol || !isMainnet) return;
    if (symbol === defaultToken.symbol) {
      getTokenPrice(symbol);
    } else {
      getTokensPrice([symbol, defaultToken.symbol]);
    }
  }, [getTokenPrice, getTokensPrice, payload, isMainnet, txParams.paramsOption?.symbol, defaultToken.symbol]);

  const renderAccountInfo = useMemo(() => {
    if (payload?.contractAddress || typeof payload?.contractAddress !== 'string') return <></>;
    return (
      <div className="account flex">
        <div className="name">{walletName}</div>
        <CustomSvg type="Oval" />
        <div className="address">{`${payload.contractAddress.slice(0, 10)}...${payload.contractAddress.slice(
          -4,
        )}`}</div>
        <div className="line" />
      </div>
    );
  }, [payload, walletName]);

  const renderTransfer = useMemo(() => {
    const { symbol, amount } = txParams.paramsOption || {};
    const decimals = symbol === defaultToken.symbol ? defaultToken.decimals : tokenDecimals;

    return (
      <div className="detail">
        <div>Details</div>
        <div className="amount">
          <div>Amount</div>
          <div className="amount-number flex-between-center">
            <div className="value">
              <span>
                {loading ? (
                  <CircleLoading />
                ) : (
                  `${formatAmountShow(divDecimals(amount, decimals), defaultToken.decimals)}`
                )}
              </span>
              <span>&nbsp;{symbol}</span>
            </div>
            {isMainnet && <div>{formatAmountInUsdShow(amount, decimals, symbol)}</div>}
          </div>
        </div>
        <div className="fee">
          <div>Transaction Fee</div>
          <div className="fee-amount flex-between-center">
            <div className="value">
              <span>{loading ? <CircleLoading /> : `${formatAmountShow(fee, defaultToken.decimals)}`}</span>
              <span>&nbsp;{defaultToken.symbol}</span>
            </div>
            {isMainnet && <div>{fee === '0' ? '$ 0' : formatAmountInUsdShow(fee, 0, defaultToken.symbol)}</div>}
          </div>
        </div>
        <div className="total">
          <div>Total (Amount + Transaction Fee)</div>
          {symbol === defaultToken.symbol ? (
            <div className="amount-show flex-between-center">
              <div className="value">
                <span>
                  {loading ? (
                    <CircleLoading />
                  ) : (
                    `${formatAmountShow(divDecimals(amount, decimals).plus(fee), defaultToken.decimals)}`
                  )}
                </span>
                <span>&nbsp;{symbol}</span>
              </div>
              {isMainnet && (
                <div>{formatAmountInUsdShow(divDecimals(amount, decimals).plus(fee).toNumber(), 0, symbol)}</div>
              )}
            </div>
          ) : (
            <>
              <div className="amount-show flex-between-center">
                <div className="value">
                  <span>{loading ? <CircleLoading /> : `${formatAmountShow(fee, defaultToken.decimals)}`}</span>
                  <span>&nbsp;{defaultToken.symbol}</span>
                </div>
                {isMainnet && <div>{fee === '0' ? '$ 0' : formatAmountInUsdShow(fee, 0, defaultToken.symbol)}</div>}
              </div>
              <div className="amount-show flex-between-center">
                <div className="value">
                  <span>
                    {loading ? (
                      <CircleLoading />
                    ) : (
                      `${formatAmountShow(divDecimals(amount, decimals), defaultToken.decimals)}`
                    )}
                  </span>
                  <span>&nbsp;{symbol}</span>
                </div>
                {isMainnet && <div>{formatAmountInUsdShow(amount, 0, symbol)}</div>}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }, [
    txParams.paramsOption,
    defaultToken.symbol,
    defaultToken.decimals,
    tokenDecimals,
    loading,
    isMainnet,
    formatAmountInUsdShow,
    fee,
  ]);

  const renderMessage = useMemo(() => {
    const params = txParams.paramsOption || {};
    return (
      <div className="message-wrapper">
        <div>Message</div>
        <div className="message flex">
          {typeof params === 'object' ? (
            Object.keys(params).map((item) => (
              <div key={item}>
                <div className="value">{item}</div>
                <div className="content">{JSON.stringify(params[item])}</div>
              </div>
            ))
          ) : (
            <div className="content">{`${params}`}</div>
          )}
        </div>
        <div className="fee">
          <div>Transaction Fee</div>
          <div className="fee-amount flex-between-center">
            <div className="value">
              <span>{loading ? <CircleLoading /> : `${formatAmountShow(fee)}`}</span>
              <span>&nbsp;{defaultToken.symbol}</span>
            </div>
            {isMainnet && <div>{fee === '0' ? '$ 0' : formatAmountInUsdShow(fee, 0, defaultToken.symbol)}</div>}
          </div>
        </div>
      </div>
    );
  }, [txParams.paramsOption, loading, fee, defaultToken.symbol, isMainnet, formatAmountInUsdShow]);

  const sendHandler = useCallback(async () => {
    try {
      if (!chainInfo?.endPoint || !wallet?.caHash) {
        closePrompt({ ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid chain id' } });
        return;
      }
      if (chainInfo?.endPoint !== payload?.rpcUrl) {
        closePrompt({ ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid rpcUrl' } });
        return;
      }

      let paramsOption = txParams.paramsOption;

      const functionName = isCAContract ? payload?.method : 'ManagerForwardCall';

      paramsOption = isCAContract
        ? paramsOption
        : {
            caHash: wallet.caHash,
            methodName: payload?.method,
            contractAddress: payload?.contractAddress,
            args: paramsOption,
          };
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
  }, [chainInfo, wallet.caHash, payload, txParams, isCAContract, privateKey]);

  return (
    <div className="send-transaction flex">
      <div className="chain flex-center">
        <CustomSvg type={isMainnet ? 'Aelf' : 'elf-icon'} />
        <span>{formatChainInfoToShow(payload?.chainId, currentNetwork)}</span>
      </div>
      {renderAccountInfo}
      <div className="method">
        <div>Method</div>
        <div className="value method-name">{payload?.method}</div>
      </div>
      {payload?.method.toLowerCase() === 'transfer' ? renderTransfer : renderMessage}
      {errMsg && <div className={clsx(!isManagerSynced && 'error-warning', 'error-message')}>{errMsg}</div>}
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
