import { useCallback } from 'react';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { IAssetToken } from '@portkey-wallet/store/store-ca/assets/type';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import CircleLoading from 'components/CircleLoading';
import './index.less';

export interface SelectTokenProps {
  tokenInfos: IAssetToken[];
  noDataMessage: string;
  toAddress?: string;
  loading: boolean;
}

export default function SelectToken({ tokenInfos = [], noDataMessage, toAddress, loading }: SelectTokenProps) {
  const userInfo = useCurrentUserInfo();
  const isMainnet = useIsMainnet();
  const onNavigate = useCallback(
    (tokenItem: IAssetToken) => {
      // TODO-SA
      console.log(tokenItem, toAddress);
    },
    [toAddress],
  );

  const renderItem = useCallback(
    (item: IAssetToken) => {
      return (
        <div key={`${item.symbol}_${item.chainId}`} className="token-item flex gap-8" onClick={() => onNavigate(item)}>
          <div className="token-icon-show">
            <TokenImageDisplay
              className="icon-symbol"
              width={40}
              symbol={item.label ?? item?.symbol}
              src={item.imageUrl}
            />
            <TokenImageDisplay
              hasBorder
              className="icon-chain"
              width={20}
              symbol={item?.displayChainName}
              src={item?.chainImageUrl}
            />
          </div>
          <div className="token-info-show gap-8 flex-1 flex-between-center">
            <div className="token-info-symbol">
              <div className="token-symbol">{item.label || item.symbol}</div>
              <div className="token-chain">{`${item.displayChainName || ''} ${isMainnet ? '' : 'Testnet'}`}</div>
            </div>
            <div className="token-info-amount">
              <div className="token-amount">
                {userInfo.hideAssets ? '******' : formatTokenAmountShowWithDecimals(item.balance, item.decimals)}
              </div>
              {!isMainnet && item.balanceInUsd && (
                <div className="token-usd">
                  {userInfo.hideAssets ? '******' : formatAmountUSDShow(item.balanceInUsd)}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    },
    [isMainnet, onNavigate, userInfo.hideAssets],
  );

  return (
    <div className="select-send-token-list">
      {loading ? (
        <CircleLoading />
      ) : tokenInfos.length === 0 ? (
        <div className="no-data-message flex-center">{noDataMessage}</div>
      ) : (
        tokenInfos.map((item) => renderItem(item))
      )}
    </div>
  );
}
