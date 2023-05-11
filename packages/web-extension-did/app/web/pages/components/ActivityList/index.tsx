import {
  SHOW_FROM_TRANSACTION_TYPES,
  TransactionTypes,
  transactionTypesMap,
} from '@portkey-wallet/constants/constants-ca/activity';
import { ActivityItemType, the2ThFailedActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { AmountSign, formatWithCommas, formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import { List } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import './index.less';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { useIsTestnet } from 'hooks/useNetwork';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { Button, Modal } from 'antd';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { dateFormatTransTo13 } from 'utils';
import { useTranslation } from 'react-i18next';
import { intervalCrossChainTransfer } from 'utils/sandboxUtil/crossChainTransfer';
import { useAppDispatch, useLoading, useUserInfo } from 'store/Provider/hooks';
import { removeFailedActivity } from '@portkey-wallet/store/store-ca/activity/slice';
import { useCurrentChainList } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import aes from '@portkey-wallet/utils/aes';
import { addressFormat } from '@portkey-wallet/utils';
import { useFreshTokenPrice, useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';

export interface IActivityListProps {
  data?: ActivityItemType[];
  chainId?: string;
  hasMore: boolean;
  loadMore: (isRetry?: boolean) => Promise<void>;
}

export default function ActivityList({ data, chainId, hasMore, loadMore }: IActivityListProps) {
  const activity = useAppCASelector((state) => state.activity);
  const isTestNet = useIsTestnet();
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const dispatch = useAppDispatch();
  const { passwordSeed } = useUserInfo();
  const wallet = useCurrentWalletInfo();
  const chainList = useCurrentChainList();
  useFreshTokenPrice();
  const amountInUsdShow = useAmountInUsdShow();

  const activityListLeftIcon = (type: TransactionTypes) => {
    const loginRelatedTypeArr = [
      TransactionTypes.ADD_MANAGER,
      TransactionTypes.REMOVE_MANAGER,
      TransactionTypes.SOCIAL_RECOVERY,
    ];
    return loginRelatedTypeArr.includes(type) ? 'socialRecovery' : 'Transfer';
  };

  const nav = useNavigate();

  const navToDetail = useCallback(
    (item: ActivityItemType) => {
      nav('/transaction', { state: { item, chainId, from: chainId ? '' : BalanceTab.ACTIVITY } });
    },
    [chainId, nav],
  );

  const amountOrIdUI = (item: ActivityItemType) => {
    const { transactionType, isReceived, amount, symbol, nftInfo, decimals } = item;
    const sign = isReceived ? AmountSign.PLUS : AmountSign.MINUS;
    return (
      <p className="row-1">
        <span>{transactionTypesMap(transactionType, nftInfo?.nftId)}</span>
        <span>
          <span>
            {nftInfo?.nftId && <span>#{nftInfo.nftId}</span>}
            {!nftInfo?.nftId && (
              <span>{`${formatWithCommas({ sign, amount, decimals, digits: 4 })} ${symbol ?? ''}`}</span>
            )}
          </span>
        </span>
      </p>
    );
  };

  const fromAndUsdUI = useCallback(
    (item: ActivityItemType) => {
      const { fromAddress, fromChainId, decimals, amount, symbol, nftInfo, transactionType } = item;
      const transFromAddress = addressFormat(fromAddress, fromChainId, 'aelf');

      return (
        <p className="row-2">
          <span>
            {SHOW_FROM_TRANSACTION_TYPES.includes(transactionType) &&
              `From: ${formatStr2EllipsisStr(transFromAddress, [7, 4])}`}
          </span>
          {nftInfo?.nftId && <span className="nft-name">{formatStr2EllipsisStr(nftInfo.alias)}</span>}
          {!isTestNet && !nftInfo?.nftId && <span>{amountInUsdShow(amount, decimals || 8, symbol)}</span>}
        </p>
      );
    },
    [amountInUsdShow, isTestNet],
  );

  const networkUI = useCallback(
    (item: ActivityItemType) => {
      /* Hidden during [SocialRecovery, AddManager, RemoveManager] */
      const { transactionType, fromChainId, toChainId } = item;
      const from = transNetworkText(fromChainId, isTestNet);
      const to = transNetworkText(toChainId, isTestNet);

      return SHOW_FROM_TRANSACTION_TYPES.includes(transactionType) && <p className="row-3">{`${from}->${to}`}</p>;
    },
    [isTestNet],
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
            {t('Transaction failed ！')}
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
        //
        const chainId = params.tokenInfo.chainId;
        const chainInfo = chainList?.filter((chain) => chain.chainId === chainId)?.[0];
        if (!chainInfo) return;
        const privateKey = aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
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
    [chainList, dispatch, passwordSeed, setLoading, showErrorModal, wallet.AESEncryptPrivateKey],
  );

  const handleResend = useCallback(
    async (e: any, resendId: string) => {
      e?.stopPropagation();
      const data = activity.failedActivityMap[resendId];
      await retryCrossChain(data);
    },
    [activity.failedActivityMap, retryCrossChain],
  );

  const resendUI = useCallback(
    (item: ActivityItemType) => {
      if (!activity.failedActivityMap[item.transactionId]) return;

      return (
        <div className="row-4">
          <Button type="primary" className="resend-btn" onClick={(e) => handleResend(e, item.transactionId)}>
            Resend
          </Button>
        </div>
      );
    },
    [activity.failedActivityMap, handleResend],
  );

  return (
    <div className="activity-list">
      <List>
        {data?.map((item, index) => (
          <List.Item key={`activityList_${item.transactionId}_${index}`}>
            <div className="activity-item" onClick={() => navToDetail(item)}>
              <div className="time">{dateFormatTransTo13(Number(item.timestamp))}</div>
              <div className="info">
                {!!item.listIcon && (
                  <div
                    className="custom-list-icon"
                    style={{
                      backgroundImage: `url(${item.listIcon})`,
                    }}
                  />
                )}
                {!item.listIcon && <CustomSvg type={activityListLeftIcon(item.transactionType)} />}

                <div className="right">
                  {amountOrIdUI(item)}
                  {fromAndUsdUI(item)}
                  {networkUI(item)}
                  {resendUI(item)}
                </div>
              </div>
            </div>
          </List.Item>
        ))}
      </List>
      <LoadingMore hasMore={hasMore} loadMore={loadMore} className="load-more" />
    </div>
  );
}
