import { SHOW_FROM_TRANSACTION_TYPES, TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import { ActivityItemType, the2ThFailedActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import {
  AmountSign,
  formatWithCommas,
  formatStr2EllipsisStr,
  formatAmountUSDShow,
} from '@portkey-wallet/utils/converter';
import { List } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useMemo } from 'react';
import { useNavigateState } from 'hooks/router';
import './index.less';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { Button, Modal } from 'antd';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { formatTransferTime, isSameDay } from '@portkey-wallet/utils/time';
import { useTranslation } from 'react-i18next';
import { intervalCrossChainTransfer } from 'utils/sandboxUtil/crossChainTransfer';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { addressFormat } from '@portkey-wallet/utils';
import { useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import getSeed from 'utils/getSeed';
import { ITransactionLocationState } from 'types/router';
import clsx from 'clsx';

export interface IActivityListProps {
  data?: ActivityItemType[];
  chainId?: string;
  hasMore: boolean;
  loadMore: (isRetry?: boolean) => Promise<void>;
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

  const activityListLeftIcon = (type: TransactionTypes) => {
    return SHOW_FROM_TRANSACTION_TYPES.includes(type) ? 'Transfer' : 'SystemActivity';
  };

  const nav = useNavigateState<ITransactionLocationState>();
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

  const dividerUI = useMemo(() => <div className="divider-center" />, []);

  const renderActivityTitle = useCallback(
    (item: ActivityItemType) => {
      const { transactionName, transactionType, isReceived, fromAddress, fromChainId, toAddress, toChainId } = item;
      const transAddress = isReceived
        ? addressFormat(fromAddress, fromChainId, currentNetwork.walletType)
        : addressFormat(toAddress, toChainId, currentNetwork.walletType);
      const showAddress = `${isReceived ? 'From' : 'To'} ${formatStr2EllipsisStr(transAddress, [8, 9])}`;
      return (
        <div className="activity-item-title">
          <div className="transaction-name">{transactionName}</div>
          <div className="transaction-address">{showAddress}</div>
          {TransactionTypes.CROSS_CHAIN_TRANSFER === transactionType && (
            <div className="cross-chain-transfer">Cross Chain Transfer</div>
          )}
        </div>
      );
    },
    [currentNetwork.walletType],
  );

  const renderActivityAmount = useCallback(
    (item: ActivityItemType) => {
      const { isReceived, amount, decimals, symbol, currentTxPriceInUsd, nftInfo } = item;
      const sign = isReceived ? AmountSign.PLUS : AmountSign.MINUS;
      return (
        <div className="activity-item-amount">
          <div className={clsx('transaction-amount', isReceived && 'received-amount')}>
            <span className="amount-show">{`${formatWithCommas({
              sign,
              amount,
              decimals,
              digits: Number(decimals),
            })}`}</span>
            {!nftInfo?.nftId && symbol && <span className="amount-symbol">{` ${symbol}`}</span>}
          </div>
          {nftInfo?.nftId ? (
            <div className="transaction-nft-symbol">{nftInfo.alias}</div>
          ) : (
            <div className={clsx('transaction-convert', !isMainnet && 'hidden-transaction-convert')}>
              {formatAmountUSDShow(currentTxPriceInUsd ?? 0)}
            </div>
          )}
        </div>
      );
    },
    [isMainnet],
  );

  const renderSystemActivityItem = useCallback((item: ActivityItemType) => {
    return (
      <div className="activity-item-system-detail">
        <span>{item?.transactionName}</span>
      </div>
    );
  }, []);

  const renderActivityIcon = useCallback((item: ActivityItemType) => {
    return item.listIcon ? (
      <div
        className="custom-list-icon"
        style={{
          backgroundImage: `url(${item.listIcon})`,
        }}
      />
    ) : (
      <CustomSvg type={activityListLeftIcon(item.transactionType)} />
    );
  }, []);

  const renderActivityItem = useCallback(
    (item: ActivityItemType, index: number) => (
      <List.Item key={`activityList_${item.transactionId}_${index}`}>
        <div
          className={clsx(
            'activity-item',
            'flex-column',
            activity.failedActivityMap[item.transactionId] && 'activity-item-resend',
          )}>
          <div className="activity-item-content flex-row-center" onClick={() => navToDetail(item)}>
            {renderActivityIcon(item)}
            {item.isSystem ? (
              renderSystemActivityItem(item)
            ) : (
              <div className="activity-item-detail flex-between-center">
                {renderActivityTitle(item)}
                {renderActivityAmount(item)}
              </div>
            )}
          </div>
          {renderResendBtn(item)}
        </div>
      </List.Item>
    ),
    [
      activity.failedActivityMap,
      renderActivityIcon,
      renderSystemActivityItem,
      renderActivityTitle,
      renderActivityAmount,
      renderResendBtn,
      navToDetail,
    ],
  );

  const renderActivityList = useMemo(() => {
    return (
      <List>
        {data?.map((item, index) => {
          if (index === 0) {
            return (
              <>
                <div key={`activityList_date_${index}`} className="activity-date-item">
                  {formatTransferTime(item.timestamp)}
                </div>
                {renderActivityItem(item, index)}
              </>
            );
          } else {
            if (isSameDay(data[index - 1].timestamp, item.timestamp)) {
              return renderActivityItem(item, index);
            } else {
              return (
                <>
                  <div key={`activityList_date_${index}`} className="activity-date-item">
                    {dividerUI}
                    {formatTransferTime(item.timestamp)}
                  </div>
                  {renderActivityItem(item, index)}
                </>
              );
            }
          }
        })}
      </List>
    );
  }, [data, dividerUI, renderActivityItem]);

  return (
    <div className="activity-list">
      {renderActivityList}
      <LoadingMore hasMore={hasMore} loadMore={loadMore} className="load-more" />
    </div>
  );
}
