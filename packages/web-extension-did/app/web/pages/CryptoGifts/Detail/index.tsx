import { useCallback, useEffect, useMemo } from 'react';
import CommonHeader from 'components/CommonHeader';
import CustomSvg from 'components/CustomSvg';
import ImageDisplay from 'pages/components/ImageDisplay';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import PromptFrame from 'pages/components/PromptFrame';
import { useCopyToClipboard } from 'react-use';
import singleMessage from 'utils/singleMessage';
import { useGetCryptoGiftDetail } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { DisplayType } from '@portkey-wallet/im/types/redPackage';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TCryptoGiftDetailLocationState } from 'types/router';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import './index.less';

export interface IClaimedInfo {
  icon?: string;
  name: string;
  isMe: boolean;
  amount: string;
  symbol: string;
  date: string;
  isLuckiest: boolean;
  pending: boolean;
  expiration?: string;
}

export default function CryptoGiftsDetail() {
  const navigate = useNavigateState();
  const { referralUrl } = useCurrentNetworkInfo();
  const { state } = useLocationState<TCryptoGiftDetailLocationState>();
  useEffect(() => {
    if (!state.id) {
      navigate('/crypto-gifts/history');
    }
  }, [navigate, state.id]);
  const { info, list, next, init } = useGetCryptoGiftDetail(state.id);
  const { isPrompt } = useCommonState();
  const [, setCopied] = useCopyToClipboard();
  const hasMore = useMemo(() => list.length < (info?.totalCount ?? 0), [info?.totalCount, list.length]);
  const onClickShare = useCallback(() => {
    setCopied(`${referralUrl}/${state.id}`);
    singleMessage.success('Copy Success');
  }, [referralUrl, setCopied, state.id]);
  useEffectOnce(() => {
    init();
  });
  const loadMore = useCallback(async () => {
    try {
      await next();
      return;
    } catch (error) {
      console.log('===getCryptoGiftDetail more error', error);
    }
  }, [next]);
  const mainContent = useMemo(
    () => (
      <div className={clsx('crypto-gifts-detail', 'flex-column', isPrompt && 'prompt-page')}>
        <CommonHeader
          onLeftBack={() => navigate('/crypto-gifts/history')}
          rightElementList={[
            {
              customSvgType: 'ShareCopy',
              onClick: onClickShare,
            },
          ]}
        />
        <div className="crypto-gifts-detail-container">
          <div className="crypto-gifts-info flex-column-center">
            <CustomSvg type="BoxClose" />
            <div className="blessing">{`"${info?.memo}"`}</div>
          </div>
          <div className="divide" />
          <div className="crypto-gifts-claimed-info flex-column">
            <div className="claimed-status">{`${info?.count}/${info?.grabbed} crypto gifts opened, with ${info?.grabbedAmount}/${info?.totalAmount} ${info?.symbol} has been claimed.`}</div>
            {(list ?? []).map((item, index) => (
              <div key={index} className="claimed-info flex-row-center">
                <div className="claimed-info-icon flex-center">
                  {item.displayType === DisplayType.Pending ? (
                    <CustomSvg type="LockFilledIcon" />
                  ) : (
                    <ImageDisplay src={item.avatar} name={item.username} defaultHeight={48} />
                  )}
                </div>
                <div className="claimed-info-detail flex-column flex-1">
                  <div className="claimed-info-top flex-between-center">
                    <div className="top-left flex-1 flex-row-center">
                      <div className="claimed-name">
                        {item.displayType === DisplayType.Pending ? 'Pending Deposit' : item.username}
                      </div>
                      {item.isMe && <div className="claimed-flag">Me</div>}
                    </div>
                    <div className="top-right flex-1">{`${item.amount} ${info?.symbol}`}</div>
                  </div>
                  <div className="claimed-info-bottom flex-between-center">
                    <div className="bottom-left">{item.grabTime}</div>
                    <div className="bottom-right">
                      {item.displayType === DisplayType.Pending && (
                        <div className="pending-date">Expiration {item.expirationTime}</div>
                      )}
                      {item.isLuckyKing && (
                        <div className="luckiest-status flex-row-center">
                          <CustomSvg type="Luckiest" />
                          Luckiest Draw
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <LoadingMore
              hasMore={hasMore}
              loadMore={loadMore}
              className={clsx('load-more', !hasMore && 'load-more-hidden')}
            />
          </div>
        </div>
      </div>
    ),
    [
      hasMore,
      info?.count,
      info?.grabbed,
      info?.grabbedAmount,
      info?.memo,
      info?.symbol,
      info?.totalAmount,
      isPrompt,
      list,
      loadMore,
      navigate,
      onClickShare,
    ],
  );

  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
