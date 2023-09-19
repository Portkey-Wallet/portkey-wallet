import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import CustomSvg from 'components/CustomSvg';
import { useIsTestnet } from 'hooks/useNetwork';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';

export default function TokenList({ tokenList }: { tokenList: TokenItemShowType[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isTestNet = useIsTestnet();
  const amountInUsdShow = useAmountInUsdShow();
  const symbolImages = useSymbolImages();
  const onNavigate = useCallback(
    (tokenInfo: TokenItemShowType) => {
      navigate('/token-detail', { state: tokenInfo });
    },
    [navigate],
  );

  const handleAddToken = useCallback(() => {
    navigate('/add-token');
    return;
  }, [navigate]);

  return (
    <>
      <ul className="token-list">
        {tokenList.map((item) => (
          <li className="token-list-item" key={`${item.chainId}_${item.symbol}`} onClick={() => onNavigate(item)}>
            {item.symbol === ELF_SYMBOL ? (
              <CustomSvg className="token-logo" type="elf-icon" />
            ) : (
              <TokenImageDisplay className="custom-logo" symbol={item.symbol} src={symbolImages[item.symbol]} />
            )}
            <div className="desc">
              <div className="info">
                <span>{item.symbol}</span>
                <span>{formatAmountShow(divDecimals(item.balance, item.decimals))}</span>
              </div>
              <div className="amount">
                <p>{transNetworkText(item.chainId, isTestNet)}</p>
                {!isTestNet && (
                  <p className="convert">{amountInUsdShow(item.balance || '', item.decimals, item.symbol)}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <div className="add-token-enter-btn" onClick={handleAddToken}>
          <CustomSvg type="PlusFilled" className="plus-filled" />
          <span>{t('Add Tokens')}</span>
        </div>
      </div>
    </>
  );
}
