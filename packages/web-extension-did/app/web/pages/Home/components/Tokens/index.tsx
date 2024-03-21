import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { PAGE_SIZE_IN_ACCOUNT_TOKEN } from '@portkey-wallet/constants/constants-ca/assets';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';

export default function TokenList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();
  const amountInUsdShow = useAmountInUsdShow();
  const caAddressInfos = useCaAddressInfoList();
  const { accountTokenList, totalRecordCount, fetchAccountTokenInfoList } = useAccountTokenInfo();
  const hasMoreTokenList = useMemo(
    () => accountTokenList.length < totalRecordCount,
    [accountTokenList.length, totalRecordCount],
  );

  useEffect(() => {
    fetchAccountTokenInfoList({ caAddressInfos, skipCount: 0, maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN });
  }, [caAddressInfos, fetchAccountTokenInfoList]);

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

  return (
    <>
      <ul className="token-list">
        {accountTokenList.map((item) => (
          <li className="token-list-item" key={`${item.chainId}_${item.symbol}`} onClick={() => onNavigate(item)}>
            <TokenImageDisplay className="custom-logo" symbol={item.symbol} src={item.imageUrl} />
            <div className="desc">
              <div className="info">
                <span>{item.symbol}</span>
                <span>{formatAmountShow(divDecimals(item.balance, item.decimals))}</span>
              </div>
              <div className="amount">
                <p>{transNetworkText(item.chainId, !isMainnet)}</p>
                {isMainnet && (
                  <p className="convert">{amountInUsdShow(item.balance || '', item.decimals, item.symbol)}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <LoadingMore hasMore={hasMoreTokenList} loadMore={getMoreTokenList} className="load-more" />

      <div>
        <div className="add-token-enter-btn" onClick={handleAddToken}>
          <CustomSvg type="PlusFilled" className="plus-filled" />
          <span>{t('Add Tokens')}</span>
        </div>
      </div>
    </>
  );
}
