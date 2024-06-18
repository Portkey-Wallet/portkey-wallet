import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tabs } from 'antd';
import MainCards from 'pages/components/BalanceCard';
import CustomTokenDrawer from 'pages/components/CustomTokenDrawer';
import { useTranslation } from 'react-i18next';
import TokenList from '../Tokens';
import Activity from '../Activity/index';
import { Transaction } from '@portkey-wallet/types/types-ca/trade';
import NFT from '../NFT/NFT';
import { useAppDispatch, useUserInfo, useCommonState, useLoading } from 'store/Provider/hooks';
import {
  useCurrentUserInfo,
  useCurrentWallet,
  useOriginChainId,
  useSetHideAssets,
} from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { getCaHolderInfoAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import CustomTokenModal from 'pages/components/CustomTokenModal';
import { IAssetItemType } from '@portkey-wallet/store/store-ca/assets/type';
import { useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import useVerifierList from 'hooks/useVerifierList';
import useGuardianList from 'hooks/useGuardianList';
import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useCheckSecurity } from 'hooks/useSecurity';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import { useExtensionETransShow } from 'hooks/cms';
import DisclaimerModal, { IDisclaimerProps, initDisclaimerData } from '../../../components/DisclaimerModal';
import './index.less';
import { useInitRamp } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { setBadge } from 'utils/FCM';
import { useFCMEnable, useReportFCMStatus } from 'hooks/useFCM';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TRampLocationState, TSendLocationState } from 'types/router';
import { useExtensionRampEntryShow } from 'hooks/ramp';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import { clsx } from 'clsx';
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';
import { formatAmountUSDShow } from '@portkey-wallet/utils/converter';
import { RampType } from '@portkey-wallet/ramp';
import { getDisclaimerData } from 'utils/disclaimer';
import { TradeTypeEnum } from 'constants/trade';
import CustomSvg from 'components/CustomSvg';
import SetNewWalletNameIcon from '../SetNewWalletNameIcon';
import { useEffectOnce } from '@portkey-wallet/hooks';
import SkeletonCom from 'pages/components/SkeletonCom';
import CommonBanner from 'components/CommonBanner';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import BigScreenHeader from 'pages/components/BigScreenHeader';

export interface TransactionResult {
  total: number;
  items: Transaction[];
}

export type TMyBalanceState = {
  key?: string;
};

export default function MyBalance() {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<string>(BalanceTab.TOKEN);
  const [navTarget, setNavTarget] = useState<'send' | 'receive'>('send');
  const [tokenOpen, setTokenOpen] = useState(false);
  const navigate = useNavigateState<TSendLocationState | TRampLocationState>();
  const { state } = useLocationState<TMyBalanceState>();
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const isMainNet = useIsMainnet();
  const { walletInfo } = useCurrentWallet();
  const { eTransferUrl = '' } = useCurrentNetworkInfo();
  const isFCMEnable = useFCMEnable();
  const { setLoading } = useLoading();
  const setHideAssets = useSetHideAssets();

  const renderTabsData = useMemo(
    () => [
      {
        label: t('Tokens'),
        key: BalanceTab.TOKEN,
        children: <TokenList />,
      },
      {
        label: t('NFTs'),
        key: BalanceTab.NFT,
        children: <NFT />,
      },
      {
        label: t('Activity'),
        key: BalanceTab.ACTIVITY,
        children: <Activity pageKey="Home-Activity" />,
      },
    ],
    [t],
  );
  const getGuardianList = useGuardianList();
  useFreshTokenPrice();
  useVerifierList();
  const initRamp = useInitRamp({ clientType: 'Extension' });
  const { isRampShow, isBuySectionShow } = useExtensionRampEntryShow();
  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
  const disclaimerData = useRef<IDisclaimerProps>(initDisclaimerData);
  const unreadCount = useUnreadCount();
  const checkSecurity = useCheckSecurity();
  const originChainId = useOriginChainId();
  const { checkDappIsConfirmed } = useDisclaimer();
  const { isETransShow } = useExtensionETransShow();
  const reportFCMStatus = useReportFCMStatus();
  const { isNotLessThan768, isPrompt } = useCommonState();
  const userInfo = useCurrentUserInfo();
  const accountBalanceUSD = useAccountBalanceUSD();
  const usdShow = useMemo(() => formatAmountUSDShow(accountBalanceUSD), [accountBalanceUSD]);
  const [detailScroll, setDetailScroll] = useState(false);
  const { homeBannerList } = useCmsBanner();

  useEffectOnce(() => {
    if (state?.key) {
      setActiveKey(state.key);
    }
  });

  useEffect(() => {
    if (!passwordSeed) return;
    appDispatch(getCaHolderInfoAsync());
    appDispatch(getSymbolImagesAsync());
  }, [appDispatch, passwordSeed]);

  useEffect(() => {
    getGuardianList({ caHash: walletInfo?.caHash });
    initRamp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMainNet]);

  useEffect(() => {
    appDispatch(fetchContactListAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedToken = useCallback(
    (v: IAssetItemType, type: 'token' | 'nft') => {
      setTokenOpen(false);
      const isNFT = type === 'nft';
      const state = {
        chainId: v.chainId,
        decimals: Number(isNFT ? v.nftInfo?.decimals : v.tokenInfo?.decimals ?? 8),
        address: isNFT ? `${v?.nftInfo?.tokenContractAddress}` : `${v?.tokenInfo?.tokenContractAddress}`,
        symbol: v.symbol,
        name: v.symbol,
        imageUrl: isNFT ? v.nftInfo?.imageUrl : v.tokenInfo?.imageUrl,
        alias: isNFT ? v.nftInfo?.alias : '',
        tokenId: isNFT ? v.nftInfo?.tokenId : '',
        isSeed: isNFT ? v.nftInfo?.isSeed : false,
        seedType: isNFT ? v.nftInfo?.seedType : SeedTypeEnum.None,
        label: v.label,
      };
      navigate(`/${navTarget}/${type}/${v.symbol}`, { state });
    },
    [navTarget, navigate],
  );

  const SelectTokenELe = useMemo(() => {
    const title = navTarget === 'receive' ? 'Select Token' : 'Select Assets';
    const searchPlaceHolder = navTarget === 'receive' ? 'Search Token' : 'Search Assets';

    return isNotLessThan768 ? (
      <CustomTokenModal
        open={tokenOpen}
        drawerType={navTarget}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        onClose={() => setTokenOpen(false)}
        onChange={(v, type) => {
          onSelectedToken(v, type);
        }}
      />
    ) : (
      <CustomTokenDrawer
        open={tokenOpen}
        drawerType={navTarget}
        title={title}
        searchPlaceHolder={searchPlaceHolder}
        height="528"
        maskClosable={true}
        placement="bottom"
        onClose={() => setTokenOpen(false)}
        onChange={(v, type) => {
          onSelectedToken(v, type);
        }}
      />
    );
  }, [isNotLessThan768, navTarget, onSelectedToken, tokenOpen]);

  const onChange = useCallback(async (key: string) => {
    setActiveKey(key);
  }, []);

  useEffect(() => {
    if (!isFCMEnable()) return;
    reportFCMStatus();
    signalrFCM.signalr && setBadge({ value: unreadCount });
  }, [isFCMEnable, reportFCMStatus, unreadCount]);

  const handleCheckSecurity = useCallback(async () => {
    try {
      setLoading(true);
      const isSafe = await checkSecurity(originChainId);
      setLoading(false);
      return isSafe;
    } catch (error) {
      setLoading(false);
      console.log('===handleCheckSecurity error', error);
      return false;
    }
  }, [checkSecurity, originChainId, setLoading]);

  const handleClickTrade = useCallback(
    async (type: TradeTypeEnum) => {
      const isSecurity = await handleCheckSecurity();
      if (!isSecurity) return;

      let tradeLink = '';
      switch (type) {
        case TradeTypeEnum.ETrans:
          tradeLink = eTransferUrl;
          break;
      }
      if (checkDappIsConfirmed(tradeLink)) {
        const openWinder = window.open(tradeLink, '_blank');
        if (openWinder) {
          openWinder.opener = null;
        }
      } else {
        disclaimerData.current = getDisclaimerData({ targetUrl: tradeLink, originUrl: tradeLink, type });
        setDisclaimerOpen(true);
      }
    },
    [checkDappIsConfirmed, eTransferUrl, handleCheckSecurity],
  );

  const handleClickBuy = useCallback(() => {
    if (!isRampShow) return;
    if (isBuySectionShow) {
      navigate('/buy');
    } else {
      navigate('/buy', { state: { side: RampType.SELL } });
    }
  }, [isBuySectionShow, isRampShow, navigate]);

  const onBalanceWrapScroll = useCallback(() => {
    const height = isPrompt ? (isNotLessThan768 ? 132 : 72) : 60;
    const targetEle = document.querySelector('.balance-tab');
    const targetTop = targetEle?.getBoundingClientRect()?.top ?? 0;
    if (targetTop <= height) {
      setDetailScroll(true);
    } else {
      setDetailScroll(false);
    }
  }, [isNotLessThan768, isPrompt]);

  const renderUsdShow = useCallback(() => {
    let text = '';
    let isHideAssets = false;
    let showSkeleton = false;
    if (isMainNet) {
      if (userInfo.hideAssets) {
        text = '******';
        isHideAssets = true;
      } else {
        text = usdShow;
        if (!usdShow) {
          showSkeleton = true;
        }
      }
    } else {
      text = 'Dev Mode';
    }
    return (
      <div className="balance-amount-content flex-row-start">
        {showSkeleton ? (
          <SkeletonCom />
        ) : (
          <>
            <div
              className={clsx(
                'balance-amount',
                text.length > 18 && 'balance-amount-long',
                isHideAssets && 'balance-amount-hidden',
              )}>
              {text}
            </div>
            {isMainNet && (
              <div className="hide-assets-icon-wrap">
                <CustomSvg
                  className="hide-assets-icon cursor-pointer"
                  type={userInfo.hideAssets ? 'EyeInvisibleOutlined' : 'EyeOutlined'}
                  onClick={() => setHideAssets(!userInfo.hideAssets)}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }, [isMainNet, setHideAssets, usdShow, userInfo.hideAssets]);

  return (
    <div className={clsx('balance', detailScroll && 'detail-scroll')} onScroll={onBalanceWrapScroll}>
      <BigScreenHeader />
      <div className="main-content-wrap flex-column">
        <div className={clsx('balance-amount-wrap', 'flex-column', isPrompt && 'is-prompt')}>
          <div className="wallet-name-wrap flex-row-center">
            {userInfo.nickName ? (
              <>
                <div className="wallet-name">{userInfo.nickName}</div>
                <SetNewWalletNameIcon />
              </>
            ) : (
              <SkeletonCom />
            )}
          </div>
          {renderUsdShow()}
        </div>
        <MainCards
          onSend={async () => {
            setNavTarget('send');
            return setTokenOpen(true);
          }}
          onReceive={() => {
            setNavTarget('receive');
            return setTokenOpen(true);
          }}
          onBuy={isRampShow ? handleClickBuy : undefined}
          onClickDeposit={isETransShow ? () => handleClickTrade(TradeTypeEnum.ETrans) : undefined}
          isShowFaucet={!isMainNet}
        />
      </div>
      {SelectTokenELe}
      {!isNotLessThan768 && <CommonBanner wrapClassName="banner-wrap" bannerList={homeBannerList} />}
      <Tabs activeKey={activeKey} onChange={onChange} items={renderTabsData} className="balance-tab" />
      <DisclaimerModal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} {...disclaimerData.current} />
    </div>
  );
}
