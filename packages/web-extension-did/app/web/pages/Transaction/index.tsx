import { SHOW_FROM_TRANSACTION_TYPES } from '@portkey-wallet/constants/constants-ca/activity';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchActivity } from '@portkey-wallet/store/store-ca/activity/api';
import { ActivityItemType, TransactionStatus } from '@portkey-wallet/types/types-ca/activity';
import { Transaction } from '@portkey-wallet/types/types-ca/trade';
import { getExploreLink } from '@portkey-wallet/utils';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import {
  formatStr2EllipsisStr,
  AmountSign,
  formatWithCommas,
  formatAmountUSDShow,
  formatTokenAmountShowWithDecimals,
} from '@portkey-wallet/utils/converter';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import './index.less';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { addressFormat } from '@portkey-wallet/utils';
import { useCommonState } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import { useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ChainId } from '@portkey-wallet/types';
import { useLocationState, useNavigateState } from 'hooks/router';
import { ITransactionLocationState, THomePageLocationState } from 'types/router';
import { getSeedTypeTag } from 'utils/assets';

export default function Transaction() {
  const { t } = useTranslation();
  const { state } = useLocationState<ITransactionLocationState>();
  const chainId = state.chainId;
  const from = state?.previousPage;
  const isMainnet = useIsMainnet();
  const caAddressInfoList = useCaAddressInfoList();
  const caAddressInfos = useMemo(() => {
    const result = caAddressInfoList.filter((ele) => ele.chainId === chainId);
    return result?.length > 0 ? result : caAddressInfoList;
  }, [caAddressInfoList, chainId]);

  useFreshTokenPrice();
  const defaultToken = useDefaultToken(chainId ? (chainId as ChainId) : undefined);

  // Obtain data through routing to ensure that the page must have data and prevent Null Data Errors.
  const [activityItem, setActivityItem] = useState<ActivityItemType>(state.item);
  const feeInfo = useMemo(() => activityItem.transactionFees, [activityItem.transactionFees]);
  const chainInfo = useCurrentChain(activityItem.fromChainId);

  // Obtain data through api to ensure data integrity.
  // Because some data is not returned in the Activities API. Such as from, to.
  useEffectOnce(() => {
    const params = {
      caAddressInfos,
      transactionId: activityItem.transactionId,
      blockHash: activityItem.blockHash,
    };
    fetchActivity(params)
      .then((res) => {
        setActivityItem(res);
      })
      .catch((error) => {
        throw Error(JSON.stringify(error));
      });
  });

  const status = useMemo(() => {
    if (activityItem?.status === TransactionStatus.Mined)
      return {
        text: 'Confirmed',
        style: 'confirmed',
      };
    return {
      text: 'Failed',
      style: 'failed',
    };
  }, [activityItem]);

  const nav = useNavigateState<THomePageLocationState>();
  const onClose = useCallback(() => {
    if (from && from === BalanceTab.ACTIVITY) {
      // come in from the activityTab, go to the homepage activityTab
      nav('/', { state: { key: BalanceTab.ACTIVITY } });
    } else {
      // come in from the token activity list, go back
      nav(-1);
    }
  }, [from, nav]);

  const isNft = useMemo(() => !!activityItem?.nftInfo?.nftId, [activityItem?.nftInfo?.nftId]);

  const nftHeaderUI = useCallback(() => {
    const { nftInfo, amount, decimals } = activityItem;
    const seedTypeTag = nftInfo ? getSeedTypeTag(nftInfo) : '';

    return (
      <div className="nft-amount">
        <div className="assets flex-center">
          {seedTypeTag && <CustomSvg type={seedTypeTag} />}
          {nftInfo?.imageUrl ? (
            <img className="assets-img" src={nftInfo?.imageUrl} />
          ) : (
            <p>{nftInfo?.alias?.slice(0, 1)}</p>
          )}
        </div>
        <div className="info">
          <p className="index">
            <span>{nftInfo?.alias}</span>
            <span className="token-id">#{nftInfo?.nftId}</span>
          </p>
          <p className="quantity">{`Amount: ${formatTokenAmountShowWithDecimals(amount, decimals)}`}</p>
        </div>
      </div>
    );
  }, [activityItem]);

  const tokenHeaderUI = useCallback(() => {
    const { amount, isReceived, decimals, symbol, transactionType, currentTxPriceInUsd = '' } = activityItem;
    const sign = isReceived ? AmountSign.PLUS : AmountSign.MINUS;
    /* Hidden during [SocialRecovery, AddManager, RemoveManager] */
    if (transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(transactionType)) {
      return (
        <div className="token-amount flex-column-center">
          <div className="token-amount-text flex-center">
            <div className="token-amount-number">
              {formatWithCommas({ amount, decimals, sign, digits: Number(decimals) })}
            </div>
            <div className="token-amount-symbol">{symbol ?? ''}</div>
          </div>
          {isMainnet && <div className="usd">{formatAmountUSDShow(currentTxPriceInUsd)}</div>}
        </div>
      );
    } else {
      return <p className="no-amount"></p>;
    }
  }, [activityItem, isMainnet]);

  const statusAndDateUI = useCallback(() => {
    return (
      <div className="status-wrap">
        <p className="label">
          <span className="left">{t('Status')}</span>
          <span className="right">{t('Date')}</span>
        </p>
        <p className="value">
          <span className={clsx(['left', status.style])}>{t(status.text)}</span>
          <span className="right">{formatTransferTime(activityItem.timestamp)}</span>
        </p>
      </div>
    );
  }, [activityItem.timestamp, status.style, status.text, t]);

  const currentNetwork = useCurrentNetworkInfo();
  const fromToUI = useCallback(() => {
    const { from, fromAddress, fromChainId, to, toAddress, toChainId, transactionType } = activityItem;
    const transFromAddress = addressFormat(fromAddress, fromChainId, currentNetwork.walletType);
    const transToAddress = addressFormat(toAddress, toChainId, currentNetwork.walletType);

    /* Hidden during [SocialRecovery, AddManager, RemoveManager] */
    return (
      transactionType &&
      SHOW_FROM_TRANSACTION_TYPES.includes(transactionType) && (
        <div className="account-wrap">
          <p className="label">
            <span className="left">{t('From')}</span>
            <span className="right">{t('To')}</span>
          </p>
          <div className="value">
            <div className="content">
              <span className="left name">{from}</span>
              {fromAddress && (
                <span className="left address-wrap">
                  <span>{formatStr2EllipsisStr(transFromAddress, [7, 4])}</span>
                  <Copy toCopy={transFromAddress} iconClassName="copy-address" />
                </span>
              )}
            </div>
            <CustomSvg type="RightArrow" className="right-arrow" />
            <div className="content">
              <span className="right name">{to}</span>
              {toAddress && (
                <span className="right address-wrap">
                  <span>{formatStr2EllipsisStr(transToAddress, [7, 4])}</span>
                  <Copy toCopy={transToAddress} iconClassName="copy-address" />
                </span>
              )}
            </div>
          </div>
        </div>
      )
    );
  }, [activityItem, currentNetwork.walletType, t]);

  const networkUI = useCallback(() => {
    /* Hidden during [SocialRecovery, AddManager, RemoveManager] */
    const { transactionType, fromChainId, toChainId } = activityItem;
    const from = transNetworkText(fromChainId, !isMainnet);
    const to = transNetworkText(toChainId, !isMainnet);

    return (
      transactionType &&
      SHOW_FROM_TRANSACTION_TYPES.includes(transactionType) && (
        <div className="network-wrap">
          <p className="label">
            <span className="left">{t('Network')}</span>
          </p>
          <p className="value">{`${from}->${to}`}</p>
        </div>
      )
    );
  }, [activityItem, isMainnet, t]);

  const noFeeUI = useCallback(() => {
    return (
      <div className="right-item">
        <span>{`0 ELF`}</span> {isMainnet && <span className="right-usd">{`$ 0`}</span>}
      </div>
    );
  }, [isMainnet]);

  const feeUI = useCallback(() => {
    return activityItem.isDelegated ? (
      <div className="value">
        <span className="left">{t('Transaction Fee')}</span>
        {noFeeUI()}
      </div>
    ) : (
      <div className="value">
        <span className="left">{t('Transaction Fee')}</span>
        <span className="right">
          {(!feeInfo || feeInfo?.length === 0) && noFeeUI()}
          {feeInfo?.length > 0 &&
            feeInfo.map((item, idx) => {
              return (
                <div key={'transactionFee' + idx} className="right-item flex-column">
                  <span>{`${formatWithCommas({
                    amount: item.fee,
                    decimals: item.decimals || defaultToken.decimals,
                    digits: Number(item.decimals),
                  })} ${item.symbol ?? ''}`}</span>
                  {isMainnet && <span className="right-usd">{formatAmountUSDShow(item?.feeInUsd)}</span>}
                </div>
              );
            })}
        </span>
      </div>
    );
  }, [activityItem.isDelegated, defaultToken.decimals, feeInfo, isMainnet, noFeeUI, t]);

  const transactionUI = useCallback(() => {
    return (
      <div className="money-wrap">
        <p className="label">
          <span className="left">{t('Transaction')}</span>
        </p>
        <div>
          <div className="value">
            <span className="left">{t('Transaction ID')}</span>
            <span className="right tx-id">
              {`${formatStr2EllipsisStr(activityItem.transactionId, [7, 4])} `}
              <Copy toCopy={activityItem.transactionId} />
            </span>
          </div>
          {feeUI()}
        </div>
      </div>
    );
  }, [activityItem.transactionId, feeUI, t]);

  const openOnExplorer = useCallback(() => {
    return getExploreLink(chainInfo?.explorerUrl || '', activityItem.transactionId || '', 'transaction');
  }, [activityItem.transactionId, chainInfo?.explorerUrl]);

  const viewOnExplorerUI = useCallback(() => {
    return (
      <a className="link" target="blank" href={openOnExplorer()}>
        {t('View on Explorer')}
      </a>
    );
  }, [openOnExplorer, t]);

  const { isPrompt } = useCommonState();

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['transaction-detail-modal', isPrompt && 'detail-page-prompt'])}>
        <div className="transaction-detail-body">
          <div className="header">
            <CustomSvg type="Close2" onClick={onClose} />
          </div>
          <div className="transaction-info">
            <div className="method-wrap">
              <p className="method-name">{activityItem?.transactionName}</p>
              {isNft ? nftHeaderUI() : tokenHeaderUI()}
            </div>
            {statusAndDateUI()}
            {fromToUI()}
            {networkUI()}
            {transactionUI()}
          </div>
        </div>
        <div className="transaction-footer">
          <div>{viewOnExplorerUI()}</div>
          {isPrompt && <PromptEmptyElement />}
        </div>
      </div>
    );
  }, [
    activityItem?.transactionName,
    fromToUI,
    isNft,
    isPrompt,
    networkUI,
    nftHeaderUI,
    onClose,
    statusAndDateUI,
    tokenHeaderUI,
    transactionUI,
    viewOnExplorerUI,
  ]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} className="transaction-detail" /> : mainContent()}</>;
}
