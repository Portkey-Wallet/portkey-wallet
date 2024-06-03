import { TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import { ActivityItemType, the2ThFailedActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import {
  AmountSign,
  formatWithCommas,
  formatStr2EllipsisStr,
  formatAmountUSDShow,
} from '@portkey-wallet/utils/converter';
import CustomSvg, { SvgType } from 'components/CustomSvg';
import { useCallback, useMemo } from 'react';
import { useNavigateState } from 'hooks/router';
import './index.less';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { Button, Modal } from 'antd';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { formatActivityTime, isSameDay } from '@portkey-wallet/utils/time';
import { useTranslation } from 'react-i18next';
import { intervalCrossChainTransfer } from 'utils/sandboxUtil/crossChainTransfer';
import { useAppDispatch, useCommonState, useLoading } from 'store/Provider/hooks';
import { removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { addressFormat } from '@portkey-wallet/utils';
import { useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import getSeed from 'utils/getSeed';
import { ITransactionLocationState } from 'types/router';
import clsx from 'clsx';
import NFTImageDisplay from '../NFTImageDisplay';
import TokenImageDisplay from '../TokenImageDisplay';
import dayjs from 'dayjs';
import ImageForTwo from '../ImageForTwo';
import ImageDisplay from '../ImageDisplay';
import { contractStatusEnum } from '@portkey-wallet/constants/constants-ca/common';

export interface IActivityListProps {
  data?: ActivityItemType[];
  chainId?: string;
  hasMore: boolean;
  loadMore: (isRetry?: boolean) => Promise<void>;
}
export interface IActivityMultiplyToken {
  symbol: string;
  url?: string;
  isReceived: boolean;
  amount: string;
  decimals: string;
}

export default function ActivityList({ data, chainId, hasMore, loadMore }: IActivityListProps) {
  const activity = useAppCASelector((state) => state.activity);
  const isMainnet = useIsMainnet();
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const dispatch = useAppDispatch();
  const chainList = useCurrentChainList();
  useFreshTokenPrice();
  const currentNetwork = useCurrentNetworkInfo();
  const nav = useNavigateState<ITransactionLocationState>();
  const { isPrompt } = useCommonState();
  const navToDetail = useCallback(
    (item: ActivityItemType) => {
      nav('/transaction', { state: { item, chainId, previousPage: chainId ? '' : BalanceTab.ACTIVITY } });
    },
    [chainId, nav],
  );

  const showErrorModal = useCallback(
    (error: the2ThFailedActivityItemType) => {
      Modal.error({
        width: 320,
        className: 'transaction-modal',
        okText: t('Resend'),
        icon: null,
        closable: false,
        centered: true,
        title: (
          <div className="flex-column-center transaction-msg">
            <CustomSvg type="warnRed" />
            {t('Transaction failed !')}
          </div>
        ),
        onOk: () => {
          console.log('retry modal addFailedActivity', error);
          retryCrossChain(error);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  const retryCrossChain = useCallback(
    async ({ transactionId, params }: the2ThFailedActivityItemType) => {
      try {
        const chainId = params.tokenInfo.chainId;
        const chainInfo = chainList?.filter((chain) => chain.chainId === chainId)?.[0];
        if (!chainInfo) return;
        const { privateKey } = await getSeed();
        if (!privateKey) return;
        setLoading(true);
        await intervalCrossChainTransfer({ ...params, chainInfo, privateKey });
        dispatch(removeFailedActivity(transactionId));
      } catch (error) {
        console.log('retry addFailedActivity', error);
        showErrorModal({ transactionId, params });
      } finally {
        setLoading(false);
      }
    },
    [chainList, dispatch, setLoading, showErrorModal],
  );

  const handleResend = useCallback(
    async (e: any, resendId: string) => {
      e?.stopPropagation();
      const data = activity.failedActivityMap[resendId];
      await retryCrossChain(data);
    },
    [activity.failedActivityMap, retryCrossChain],
  );

  const formatActivityTimeShow = useCallback(
    (timestamp: string) => formatActivityTime(dayjs.unix(Number(timestamp || 0))),
    [],
  );

  const renderResendBtn = useCallback(
    (item: ActivityItemType) => {
      if (!activity.failedActivityMap[item.transactionId]) return;

      return (
        <div className="activity-item-resend-btn">
          <Button type="primary" className="resend-btn" onClick={(e) => handleResend(e, item.transactionId)}>
            Resend
          </Button>
        </div>
      );
    },
    [activity.failedActivityMap, handleResend],
  );

  const formatAddressShow = useCallback(
    (item: ActivityItemType) => {
      const { isReceived, fromAddress, fromChainId, toAddress, toChainId } = item;
      let transAddress = '';
      if (isReceived) {
        transAddress = fromAddress ? addressFormat(fromAddress, fromChainId, currentNetwork.walletType) : '';
      } else {
        transAddress = toAddress ? addressFormat(toAddress, toChainId, currentNetwork.walletType) : '';
      }
      return transAddress ? `${isReceived ? 'From' : 'To'} ${formatStr2EllipsisStr(transAddress, [7, 9])}` : '';
    },
    [currentNetwork.walletType],
  );

  const renderStatusIcon = useCallback((item: ActivityItemType) => {
    let svg = '';
    if (item.status === contractStatusEnum.MINED) svg = 'SuggestCheck';
    if (item.status === contractStatusEnum.FAIL) svg = 'SuggestClose2';
    if (item.status === contractStatusEnum.PENDING) svg = 'Status';
    if (svg) return <CustomSvg className="flex-center" type={svg as SvgType} />;
    return null;
  }, []);

  const renderActivityTitleForDapp = useCallback(
    (item: ActivityItemType) => (
      <div className={clsx('activity-item-title', isPrompt && 'prompt-activity-item-title')}>
        <div className="flex-row-center gap-4">
          <div className="transaction-name">{item.transactionName}</div>
          {renderStatusIcon(item)}
        </div>
        <div className="transaction-dapp-name">{item.dappName}</div>
      </div>
    ),
    [isPrompt, renderStatusIcon],
  );

  const renderActivityTitle = useCallback(
    (item: ActivityItemType) => {
      const { transactionName, transactionType } = item;
      return (
        <div className={clsx('activity-item-title', isPrompt && 'prompt-activity-item-title')}>
          <div className="flex-row-center gap-4">
            <div className="transaction-name">{transactionName}</div>
            {renderStatusIcon(item)}
          </div>

          <div className="transaction-address">{formatAddressShow(item)}</div>
          {TransactionTypes.CROSS_CHAIN_TRANSFER === transactionType && (
            <div className="cross-chain-transfer">Cross-Chain Transfer</div>
          )}
        </div>
      );
    },
    [formatAddressShow, isPrompt, renderStatusIcon],
  );

  const renderActivityAmountForMulToken = useCallback(
    (item: IActivityMultiplyToken[]) => {
      const [tokenTop, tokenBottom] = item;
      const sameDirection = tokenTop.isReceived === tokenBottom.isReceived;
      return (
        <div
          className={clsx(
            'activity-item-amount',
            sameDirection ? 'same-direction' : 'opposite-direction',
            isPrompt && 'prompt-activity-item-amount',
          )}>
          {item.map((_token, index) => (
            <div
              key={`transaction-mul-token-amount_${index}`}
              className={clsx(
                'transaction-amount',
                _token.isReceived && 'received-amount',
                `transaction-amount-${index}`,
              )}>
              <span className="amount-show">{`${formatWithCommas({
                sign: _token.isReceived ? AmountSign.PLUS : AmountSign.MINUS,
                amount: _token.amount,
                decimals: _token.decimals,
                digits: Number(_token.decimals),
              })}`}</span>
              {_token.symbol && <span className="amount-symbol">{` ${_token.symbol}`}</span>}
            </div>
          ))}
        </div>
      );
    },
    [isPrompt],
  );

  const renderActivityAmount = useCallback(
    (item: ActivityItemType) => {
      const { isReceived, amount, decimals, symbol, currentTxPriceInUsd, nftInfo } = item;
      const sign = isReceived ? AmountSign.PLUS : AmountSign.MINUS;
      return (
        <div className={clsx('activity-item-amount', isPrompt && 'prompt-activity-item-amount')}>
          <div className={clsx('transaction-amount', isReceived && 'received-amount')}>
            <span className="amount-show">{`${formatWithCommas({
              sign,
              amount,
              decimals,
              digits: Number(decimals),
            })}`}</span>
            {(nftInfo?.alias || symbol) && <span className="amount-symbol">{` ${nftInfo?.alias || symbol}`}</span>}
          </div>
          <div className={clsx('transaction-convert', !isMainnet && 'hidden-transaction-convert')}>
            {formatAmountUSDShow(currentTxPriceInUsd)}
          </div>
        </div>
      );
    },
    [isMainnet, isPrompt],
  );

  const renderTxActivityItemForDefault = useCallback(
    (item: ActivityItemType) => {
      return (
        <>
          {item.nftInfo ? (
            <NFTImageDisplay
              src={item.listIcon}
              isSeed={item.nftInfo.isSeed}
              seedType={item.nftInfo.seedType}
              alias={item.nftInfo.alias}
              className="nft-activity-icon"
            />
          ) : (
            <TokenImageDisplay className="token-activity-icon" src={item.listIcon} symbol={item.symbol} />
          )}
          <div className="activity-item-detail flex-between-center">
            {renderActivityTitle(item)}
            {renderActivityAmount(item)}
          </div>
        </>
      );
    },
    [renderActivityAmount, renderActivityTitle],
  );

  const renderMulTokenForDapp = useCallback(
    (item: ActivityItemType) => {
      const { operations = [] } = item;
      if (operations.length < 2) return null;
      let [tokenTop, tokenBottom] = operations.map((_token) => ({
        symbol: _token.nftInfo ? _token.nftInfo.alias : _token.symbol,
        url: _token.nftInfo ? _token.nftInfo.imageUrl : _token.icon,
        isReceived: _token.isReceived,
        amount: _token.amount,
        decimals: _token.decimals,
      }));
      const sameDirection = tokenTop.isReceived === tokenBottom.isReceived;
      if (!sameDirection && !tokenTop.isReceived) {
        [tokenBottom, tokenTop] = [tokenTop, tokenBottom];
      }
      let renderTopIconInfo = { url: tokenTop.url, symbol: tokenTop.symbol };
      let renderBottomIconInfo = { url: tokenBottom.url, symbol: tokenBottom.symbol };
      if (!sameDirection) {
        [renderTopIconInfo, renderBottomIconInfo] = [renderBottomIconInfo, renderTopIconInfo];
      }
      return (
        <>
          <ImageForTwo className="token-activity-icon" iconTop={renderTopIconInfo} iconBottom={renderBottomIconInfo} />
          <div className="activity-item-detail flex-between-center">
            {renderActivityTitleForDapp(item)}
            {renderActivityAmountForMulToken([tokenTop, tokenBottom])}
          </div>
        </>
      );
    },
    [renderActivityAmountForMulToken, renderActivityTitleForDapp],
  );

  const renderSingleTokenForDapp = useCallback(
    (item: ActivityItemType) => {
      return (
        <>
          {item.nftInfo ? (
            <NFTImageDisplay
              src={item.nftInfo.imageUrl}
              isSeed={item.nftInfo.isSeed}
              seedType={item.nftInfo.seedType}
              alias={item.nftInfo.alias}
              className="nft-activity-icon"
            />
          ) : (
            <TokenImageDisplay className="token-activity-icon" src={item.listIcon} symbol={item.symbol} />
          )}
          <div className="activity-item-detail flex-between-center">
            {renderActivityTitleForDapp(item)}
            {renderActivityAmount(item)}
          </div>
        </>
      );
    },
    [renderActivityAmount, renderActivityTitleForDapp],
  );

  const renderTxActivityItem = useCallback(
    (item: ActivityItemType) => {
      const { operations = [], dappName } = item;
      if (operations.length !== 0) return renderMulTokenForDapp(item);
      if (dappName) return renderSingleTokenForDapp(item);
      return renderTxActivityItemForDefault(item);
    },
    [renderMulTokenForDapp, renderSingleTokenForDapp, renderTxActivityItemForDefault],
  );

  const renderEmptyTokenForDapp = useCallback(
    (item: ActivityItemType) => {
      return (
        <>
          <ImageDisplay
            src={item.dappIcon}
            name={item.dappName || 'Unknown'}
            defaultHeight={32}
            className="system-activity-icon"
          />
          <div className="activity-item-detail flex-between-center">{renderActivityTitleForDapp(item)}</div>
        </>
      );
    },
    [renderActivityTitleForDapp],
  );

  const renderSystemActivityItem = useCallback(
    (item: ActivityItemType) => (
      <>
        <ImageDisplay
          src={item.listIcon}
          backupSrc="SystemActivity"
          defaultHeight={32}
          className="system-activity-icon"
        />
        <div className="activity-item-system-detail">
          <span className="flex-row-center gap-4">
            {item?.transactionName}
            {renderStatusIcon(item)}
          </span>
        </div>
      </>
    ),
    [renderStatusIcon],
  );

  const renderActivityItem = useCallback(
    (item: ActivityItemType) => {
      const isEmptyToken = !(item.nftInfo || item.symbol || item.operations?.length);
      const isDappTx = !!item.dappName;
      // show login
      const isShowEmptyTokenForDapp = isEmptyToken && isDappTx;
      const isShowSystemForDefault = isEmptyToken && !isDappTx;
      const isShowTx = !isEmptyToken;
      return (
        <div
          className={clsx(
            'activity-item',
            'flex-column',
            activity.failedActivityMap[item.transactionId] && 'activity-item-resend',
          )}>
          <div className="activity-item-content flex-row-center" onClick={() => navToDetail(item)}>
            {isShowEmptyTokenForDapp && renderEmptyTokenForDapp(item)}
            {isShowSystemForDefault && renderSystemActivityItem(item)}
            {isShowTx && renderTxActivityItem(item)}
          </div>
          {renderResendBtn(item)}
        </div>
      );
    },
    [
      activity.failedActivityMap,
      renderEmptyTokenForDapp,
      renderSystemActivityItem,
      renderTxActivityItem,
      renderResendBtn,
      navToDetail,
    ],
  );

  const renderActivityList = useMemo(() => {
    return (
      <div>
        {data?.map((item, index) => {
          if (index === 0) {
            return (
              <div key={`activityList_date_${index}`} className="activity-date-wrap">
                <div className="activity-date-item">{formatActivityTimeShow(item?.timestamp)}</div>
                {renderActivityItem(item)}
              </div>
            );
          } else {
            if (isSameDay(data[index - 1].timestamp, item.timestamp)) {
              return <div key={`activityList_${item.transactionId}_${index}`}>{renderActivityItem(item)}</div>;
            } else {
              return (
                <div key={`activityList_date_${index}`} className="activity-date-wrap">
                  <div className="activity-date-item">{formatActivityTimeShow(item?.timestamp)}</div>
                  {renderActivityItem(item)}
                </div>
              );
            }
          }
        })}
      </div>
    );
  }, [data, formatActivityTimeShow, renderActivityItem]);

  return (
    <div className={clsx('activity-list', !hasMore && 'hidden-loading-more')}>
      {renderActivityList}
      <LoadingMore hasMore={hasMore} loadMore={loadMore} className="load-more" />
    </div>
  );
}
