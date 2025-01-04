import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioChangeEvent } from 'antd';
import { useNavigate } from 'react-router';
import { useFetchTxFee } from '@portkey-wallet/hooks/hooks-ca/useTxFee';
import { useEffectOnce } from 'react-use';
import CustomTipModal from 'pages/components/CustomModal';
import { IRampCryptoItem, RampType } from '@portkey-wallet/ramp';
import { BUY_SOON_TEXT, SELL_SOON_TEXT } from '@portkey-wallet/constants/constants-ca/ramp';
import { useCheckSecurity } from 'hooks/useSecurity';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import singleMessage from 'utils/singleMessage';
import { usePromptLocationParams } from 'hooks/router';
import { TRampLocationState } from 'types/router';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import { RampHomePureComponent, setLoading } from '@portkey/did-ui-react';
import { useBuyCryptoList, useSellCryptoList } from '@portkey-wallet/hooks/hooks-ca/ramp';
import './index.less';

export default function Buy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locationParams: state } = usePromptLocationParams<TRampLocationState, TRampLocationState>();
  const checkSecurity = useCheckSecurity();

  const [page, setPage] = useState<RampType>(state?.side || RampType.BUY);

  const { isBuySectionShow, isSellSectionShow, refreshRampShow } = useExtensionRampEntryShow();

  useFetchTxFee();

  useEffectOnce(() => {
    if (!isBuySectionShow && isSellSectionShow) {
      const side = RampType.SELL;
      setPage(side);
    }
  });

  const handlePageChange = useCallback(
    async (e: RadioChangeEvent) => {
      refreshRampShow(); // fetch on\off ramp is display

      const side = e.target.value;
      // Compatible with the situation where the function is turned off when the user is on the page.
      if (side === RampType.BUY && !isBuySectionShow) {
        CustomTipModal({
          content: t(BUY_SOON_TEXT),
        });
        return;
      }
      if (side === RampType.SELL && !isSellSectionShow) {
        CustomTipModal({
          content: t(SELL_SOON_TEXT),
        });
        return;
      }

      // CHECK 2: security
      if (side === RampType.SELL) {
        try {
          setLoading(true);
          const securityRes = await checkSecurity(MAIN_CHAIN_ID);
          setLoading(false);
          if (!securityRes) return;
        } catch (error) {
          setLoading(false);
          singleMessage.error(handleErrorMessage(error));
        }
      }

      // stopInterval();
      setPage(side);
    },
    [checkSecurity, isBuySectionShow, isSellSectionShow, refreshRampShow, t],
  );

  // const handleBack = useCallback(() => {
  //   if (state) {
  //     if (state.mainPageInfo?.pageName === 'crypto-gift') {
  //       navigate('/crypto-gifts/create');
  //       return;
  //     }
  //     if (state.tokenInfo) {
  //       navigate('/token-detail', {
  //         state: state.tokenInfo,
  //       });
  //       return;
  //     }
  //   }
  //   navigate('/');
  // }, [navigate, state]);

  const { buyCryptoList, refresh: refreshBuyCryptoList } = useBuyCryptoList();
  const { sellCryptoList, refresh: refreshSellCryptoList } = useSellCryptoList();
  const list = useMemo(() => {
    if (page === RampType.BUY) {
      return buyCryptoList;
    }
    if (page === RampType.SELL) {
      return sellCryptoList;
    }
    return [];
  }, [buyCryptoList, page, sellCryptoList]);
  useEffect(() => {
    if (list && list.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
      refreshBuyCryptoList();
      refreshSellCryptoList();
    }
  }, [list, refreshBuyCryptoList, refreshSellCryptoList]);
  const onCryptoClick = useCallback(
    (item: Omit<IRampCryptoItem, 'displayChainName' | 'chainImageUrl'>) => {
      if (page === RampType.BUY) {
        // navigate('buy/', { symbol: item.symbol, network: item.network });
        navigate('/buy/ramp-buy', {
          state: {
            symbol: item.symbol,
            network: item.network,
            chainId: item.chainId,
            decimals: item.decimals,
            icon: item.icon,
            address: item.address,
          },
        });
      }
      if (page === RampType.SELL) {
        // navigate('RampSell', { symbol: item.symbol, network: item.network });
        navigate('/buy/ramp-sell', {
          state: {
            symbol: item.symbol,
            network: item.network,
            chainId: item.chainId,
            decimals: item.decimals,
            icon: item.icon,
            address: item.address,
          },
        });
      }
      return;
    },
    [navigate, page],
  );
  const mainContent = useMemo(
    () => (
      <RampHomePureComponent
        page={page}
        list={list || []}
        handlePageChange={handlePageChange}
        onBack={() => {
          navigate(-1);
        }}
        onItemClick={onCryptoClick}
      />
    ),
    [handlePageChange, list, navigate, onCryptoClick, page],
  );

  return <>{mainContent}</>;
}
