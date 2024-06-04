import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { PAGE_SIZE_IN_ACCOUNT_TOKEN } from '@portkey-wallet/constants/constants-ca/assets';
import { useCaAddressInfoList, useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import './index.less';
import { useEffectOnce } from 'react-use';
import useGAReport from 'hooks/useGAReport';
import clsx from 'clsx';

export default function TokenList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();
  const caAddressInfos = useCaAddressInfoList();
  const userInfo = useCurrentUserInfo();
  const { accountTokenList, totalRecordCount, fetchAccountTokenInfoList } = useAccountTokenInfo();
  const hasMoreTokenList = useMemo(
    () => accountTokenList.length < totalRecordCount,
    [accountTokenList.length, totalRecordCount],
  );

  const { startReport, endReport } = useGAReport();

  useEffectOnce(() => {
    startReport('Home-TokenList');
  });

  useEffect(() => {
    fetchAccountTokenInfoList({ caAddressInfos, skipCount: 0, maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN }).then(() => {
      endReport('Home-TokenList');
    });
  }, [caAddressInfos, endReport, fetchAccountTokenInfoList]);

  const onNavigate = useCallback(
    (tokenInfo: TokenItemShowType) => {
      navigate('/token-detail', { state: tokenInfo });
    },
    [navigate],
  );

  const getMoreTokenList = useCallback(async () => {
    if (accountTokenList.length < totalRecordCount) {
      await fetchAccountTokenInfoList({
        caAddressInfos,
        skipCount: accountTokenList.length,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      });
    }
  }, [accountTokenList.length, caAddressInfos, fetchAccountTokenInfoList, totalRecordCount]);

  const handleAddToken = useCallback(() => {
    navigate('/add-token');
    return;
  }, [navigate]);

  const getTokenAmount = useCallback(
    (item: TokenItemShowType) =>
      userInfo.hideAssets ? '****' : formatTokenAmountShowWithDecimals(item.balance, item.decimals),
    [userInfo.hideAssets],
  );

  const getAmountUSDShow = useCallback(
    (item: TokenItemShowType) => {
      const formatAmount = formatAmountUSDShow(item?.balanceInUsd);
      let text = '';
      if (isMainnet && formatAmount) {
        if (userInfo.hideAssets) {
          text = '****';
        } else {
          text = formatAmount;
        }
        return <span className="convert">{text}</span>;
      }
      return null;
    },
    [isMainnet, userInfo.hideAssets],
  );

  return (
    <div className={clsx('tab-token', !hasMoreTokenList && 'hidden-loading-more')}>
      <ul className="token-list">
        {accountTokenList.map((item) => (
          <li
            className="token-list-item flex-row-center"
            key={`${item.chainId}_${item.symbol}`}
            onClick={() => onNavigate(item)}>
            <TokenImageDisplay width={36} className="token-icon" symbol={item.symbol} src={item.imageUrl} />
            <div className="token-desc">
              <div className="info flex-between">
                <span>{item.symbol}</span>
                <span>{getTokenAmount(item)}</span>
              </div>
              <div className="amount flex-between">
                <span>{transNetworkText(item.chainId, !isMainnet)}</span>
                {getAmountUSDShow(item)}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <LoadingMore hasMore={hasMoreTokenList} loadMore={getMoreTokenList} className="load-more" />

      <div className="add-token-wrapper flex-center" onClick={handleAddToken}>
        <span className="add-token-text">{t('Add Tokens')}</span>
      </div>
    </div>
  );
}
