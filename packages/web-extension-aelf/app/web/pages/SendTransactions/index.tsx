import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { ChainId } from '@portkey-wallet/types';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import { divDecimals, formatAmountShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { formatChainInfoToShow, handleErrorMessage } from '@portkey-wallet/utils';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import usePromptSearch from 'hooks/usePromptSearch';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useDapp } from 'store/Provider/hooks';
import errorHandler from 'utils/errorHandler';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import { callSendMethod } from 'utils/sandboxUtil/sendTransactions';
import { useAmountInUsdShow, useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-eoa/useTokensPrice';
import getTransferFee from './utils/getTransferFee';
import { ResponseCode } from '@portkey/provider-types';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import CircleLoading from 'components/CircleLoading';
import { request } from '@portkey-wallet/api/api-did';
import DappSession from 'pages/components/DappSession';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-eoa/dapp';
import './index.less';
import { getCurrentAccountByAElfWalletType } from 'utils/getManager';
import { useCheckSiteIsInBlackList } from '@portkey-wallet/hooks/hooks-eoa/cms';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';
import { useGetContractUpgradeTime } from '@portkey-wallet/graphql/dappSecurity/hooks';
import { checkTimeOver12 } from '@portkey-wallet/utils/check';
import { formatDateTime } from '@portkey-wallet/utils/format';
import { DappSiteInfo } from 'pages/components/DappSiteInfo';
import { PromptCardType } from 'pages/Send';
import { CommonPromptCard, formatStr2EllipsisStr } from '@portkey/did-ui-react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { ToggleContent } from 'pages/components/ToggleContent';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';

type TInfoItem = {
  title: string;
  content: ReactNode;
};

export default function SendTransactions() {
  const { payload, transactionInfoId, origin } = usePromptSearch<{
    payload: {
      chainId: ChainId;
      contractAddress: string;
      method: string;
      rpcUrl: string;
    };
    origin: string;
    transactionInfoId: string;
  }>();

  const currentNetwork = useCurrentNetwork();
  const { dappMap } = useDapp();
  const curDapp = useMemo(
    () => dappMap[currentNetwork]?.find((item) => item.origin === origin),
    [currentNetwork, dappMap, origin],
  );

  const chainInfo = useCurrentChain(payload?.chainId);
  const userInfo = useCurrentAccount();
  const isMainnet = useIsMainnet();
  const { t } = useTranslation();
  const amountInUsdShow = useAmountInUsdShow();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, getTokenPrice, getTokensPrice] = useGetCurrentAccountTokenPrice();
  const [fee, setFee] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokenDecimals, setTokenDecimals] = useState(0);
  const defaultToken = useDefaultToken(payload?.chainId);
  const [txParams, setTxParams] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const [exp, setExp] = useState<SessionExpiredPlan>(SessionExpiredPlan.hour1);
  const updateSessionInfo = useUpdateSessionInfo();
  const getContractUpgradeTime = useGetContractUpgradeTime();
  const [contractUpgradeTimeResult, setContractUpgradeTimeResult] = useState<{
    isInit: boolean;
    isTimeOver12: boolean;
    formatTime: string;
  }>({
    isInit: true,
    isTimeOver12: true,
    formatTime: '',
  });
  useEffect(() => {
    (async () => {
      if (!payload?.chainId) {
        return;
      }
      const result = await getContractUpgradeTime({
        input: {
          chainId: payload?.chainId,
          address: payload.contractAddress || '',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      console.log('wfs===result', result);
      const blockTime = result.data.contractList.items[0].metadata.block.blockTime;
      setContractUpgradeTimeResult({
        isInit: false,
        isTimeOver12: checkTimeOver12(blockTime),
        formatTime: formatDateTime(blockTime),
      });
    })();
  }, [getContractUpgradeTime, payload?.chainId, payload.contractAddress]);

  const checkOriginInBlackList = useCheckSiteIsInBlackList();

  const getFee = useCallback(
    async (txInfo: any) => {
      const { privateKey } = await getSeed();
      if (!privateKey) return;
      if (!chainInfo?.endPoint) return;
      console.log('getFee====', txInfo, payload);
      const method = payload?.method;
      const paramsOption = txInfo.paramsOption;

      const fee = await getTransferFee({
        rpcUrl: chainInfo.endPoint,
        chainType: 'aelf',
        methodName: method,
        paramsOption,
        privateKey,
        contractAddress: payload.contractAddress,
      });
      console.log('getFee==== result', fee);
      if (fee === '--') {
        setFee('0');
        setErrMsg('Failed to estimate transaction fee');
      } else {
        setFee(fee);
        setErrMsg('');
      }
    },
    [chainInfo, payload],
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
    getFee(params);
    setErrMsg('');
  }, [getFee, getTokenDecimals, payload?.chainId, transactionInfoId]);

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

  const handleSessionChange = useCallback((flag: boolean, extTime: SessionExpiredPlan) => {
    setOpen(flag);
    setExp(extTime);
  }, []);

  const sendHandler = useDebounceCallback(
    async () => {
      try {
        console.log('sendHandler====', payload, chainInfo, txParams);
        if (!chainInfo?.endPoint) {
          closePrompt({
            ...errorHandler(400001),
            data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid chain id' },
          });
          return;
        }
        if (chainInfo?.endPoint !== payload?.rpcUrl) {
          closePrompt({ ...errorHandler(400001), data: { code: ResponseCode.ERROR_IN_PARAMS, msg: 'invalid rpcUrl' } });
          return;
        }

        const paramsOption = txParams.paramsOption;

        const functionName = payload?.method;

        const { privateKey } = await getSeed();
        if (!privateKey) throw 'Invalid user information, please check';
        const result = await callSendMethod({
          rpcUrl: chainInfo.endPoint,
          chainType: 'aelf',
          methodName: functionName,
          paramsOption,
          privateKey,
          address: payload.contractAddress,
          sendOptions: { onMethod: 'transactionHash' },
        });
        if (open) {
          const manager = await getCurrentAccountByAElfWalletType();
          updateSessionInfo({
            networkType: currentNetwork,
            origin,
            expiredPlan: exp,
            manager,
          });
        } else {
          updateSessionInfo({ origin });
        }
        closePrompt({
          ...errorHandler(0),
          data: result.result,
        });
      } catch (error) {
        console.error(error, 'error===detail');
        singleMessage.error(handleErrorMessage(error));
      }
    },
    [
      chainInfo,
      payload?.rpcUrl,
      payload?.method,
      payload?.contractAddress,
      txParams.paramsOption,
      open,
      updateSessionInfo,
      currentNetwork,
      origin,
      exp,
    ],
    500,
  );

  const isTransfer = useMemo(() => payload?.method.toLowerCase() === 'transfer', [payload?.method]);
  const infoList = useMemo<TInfoItem[]>(() => {
    const { symbol, amount } = txParams.paramsOption || {};
    const decimals = symbol === defaultToken.symbol ? defaultToken.decimals : tokenDecimals;
    const list: TInfoItem[] = [
      {
        title: 'Method',
        content: payload?.method || '',
      },
      {
        title: 'From',
        content: (
          <>
            <span>{userInfo?.name || ''}</span>
            <span className="send-transaction-info-item-content-sub">{`ELF_${formatStr2EllipsisStr(
              // wallet?.[payload?.chainId]?.caAddress || '',
              userInfo?.address || '',
              [4, 4],
            )}_${payload?.chainId}`}</span>
          </>
        ),
      },
      {
        title: 'Network',
        content: (
          <div className="info-item-chain-wrap">
            <CustomSvgV3
              type={payload.chainId === 'AELF' ? 'Chain=AELF Main' : 'Chain=AELF Side'}
              className="info-item-chain-icon"
            />
            <span>{formatChainInfoToShow(payload?.chainId)}</span>
          </div>
        ),
      },
      {
        title: 'Transaction Fee',
        content: loading ? (
          <CircleLoading />
        ) : (
          <>
            <span>{`${formatAmountShow(fee, defaultToken.decimals)} ${defaultToken.symbol}`}</span>
            {isMainnet && (
              <span className="send-transaction-info-item-content-sub">
                {fee === '0' ? '$0' : amountInUsdShow(fee, 0, defaultToken.symbol)}
              </span>
            )}
          </>
        ),
      },
    ];

    if (isTransfer) {
      if (symbol === defaultToken.symbol) {
        list.push({
          title: 'Total',
          content: loading ? (
            <CircleLoading />
          ) : (
            <>
              <span>{`${formatAmountShow(
                divDecimals(amount, decimals).plus(fee),
                defaultToken.decimals,
              )} ${symbol}`}</span>
              {isMainnet && (
                <span className="send-transaction-info-item-content-sub">
                  {amountInUsdShow(divDecimals(amount, decimals).plus(fee).toNumber(), 0, symbol)}
                </span>
              )}
            </>
          ),
        });
      } else {
        list.push({
          title: 'Total',
          content: loading ? (
            <CircleLoading />
          ) : (
            <>
              <span>{`${formatAmountShow(fee, defaultToken.decimals)} ${defaultToken.symbol}`}</span>
              {isMainnet && (
                <span className="send-transaction-info-item-content-sub">
                  {fee === '0' ? '$ 0' : amountInUsdShow(fee, 0, defaultToken.symbol)}
                </span>
              )}
            </>
          ),
        });
        if (!loading) {
          list.push({
            title: '',
            content: (
              <>
                <span>{`${formatTokenAmountShowWithDecimals(amount, decimals)} ${symbol}`}</span>
                {isMainnet && (
                  <span className="send-transaction-info-item-content-sub">
                    {amountInUsdShow(amount, decimals, symbol)}
                  </span>
                )}
              </>
            ),
          });
        }
      }
    }

    return list;
  }, [
    defaultToken.decimals,
    defaultToken.symbol,
    fee,
    amountInUsdShow,
    isMainnet,
    isTransfer,
    loading,
    payload.chainId,
    payload?.method,
    tokenDecimals,
    txParams.paramsOption,
    userInfo?.name,
    // wallet,
  ]);

  const transferAmount = useMemo(() => {
    const { symbol, amount } = txParams.paramsOption || {};
    const decimals = symbol === defaultToken.symbol ? defaultToken.decimals : tokenDecimals;

    return (
      <>
        <span>{loading ? <CircleLoading /> : `-${formatTokenAmountShowWithDecimals(amount, decimals)}`}</span>
        <span>&nbsp;{symbol}</span>
      </>
    );
  }, [defaultToken.decimals, defaultToken.symbol, loading, tokenDecimals, txParams.paramsOption]);
  const transferAmountUsd = useMemo(() => {
    const { symbol, amount } = txParams.paramsOption || {};
    const decimals = symbol === defaultToken.symbol ? defaultToken.decimals : tokenDecimals;
    return amountInUsdShow(amount, decimals, symbol);
  }, [defaultToken.decimals, defaultToken.symbol, amountInUsdShow, tokenDecimals, txParams.paramsOption]);

  const dataList = useMemo(() => {
    const list: Array<{ title: string; value: string }> = [];
    const params = txParams.paramsOption || {};

    Object.entries(params).forEach(([key, value]) => {
      try {
        list.push({
          title: key,
          value: JSON.stringify(value),
        });
      } catch (error) {
        console.log('send transaction data error', error);
      }
    });

    return list;
  }, [txParams.paramsOption]);

  return (
    <div className="send-transaction">
      <div className="send-transaction-body">
        <DappSiteInfo className="send-transaction-site" title="Approve transaction" dappInfo={curDapp} />

        {contractUpgradeTimeResult?.formatTime && (
          <CommonPromptCard
            className="send-transaction-warning-tip"
            type={contractUpgradeTimeResult.isTimeOver12 ? PromptCardType.INFO : PromptCardType.WARNING}
            description={`Contract update time: ${
              contractUpgradeTimeResult?.formatTime || ''
            } The dApp's smart contract has been updated. Please proceed with caution.`}
          />
        )}

        {isTransfer && (
          <div className="send-transaction-transfer-amount-wrap">
            <div className="send-transaction-transfer-amount">{transferAmount}</div>
            {isMainnet && !loading && <div className="send-transaction-transfer-usd">{transferAmountUsd}</div>}
          </div>
        )}

        <div className="send-transaction-info-list-wrap">
          {infoList.map((item) => (
            <div key={item.title} className="send-transaction-info-item-wrap">
              <div className="send-transaction-info-item-title">{item.title}</div>
              <div className="send-transaction-info-item-content">{item.content}</div>
            </div>
          ))}
        </div>

        {!isTransfer && (
          <ToggleContent title="Data" bodyClassName="send-transaction-data-body">
            <div className="send-transaction-data-list-container">
              {dataList.map((item) => (
                <div key={item.title} className="send-transaction-data-item">
                  <span className="send-transaction-data-item-title">{item.title}</span>
                  <span className="send-transaction-data-item-value">{item.value}</span>
                </div>
              ))}
            </div>
          </ToggleContent>
        )}

        {errMsg && <div className="error-message">{errMsg}</div>}

        {!checkOriginInBlackList(origin) && (
          <DappSession className="send-transaction-session" onChange={handleSessionChange} />
        )}
      </div>

      <div className="send-transaction-footer">
        <div className="send-transaction-footer-body">
          <Button
            onClick={() => {
              closePrompt(errorHandler(200003));
            }}>
            {t('Reject')}
          </Button>
          <Button type="primary" onClick={sendHandler}>
            {t('Sign')}
          </Button>
        </div>
        <div className="send-transaction-footer-tip">{'Only approve if you trust this website'}</div>
      </div>
    </div>
  );
}
