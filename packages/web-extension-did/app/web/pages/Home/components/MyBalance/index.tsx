import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tabs } from 'antd';
import BalanceCard from 'pages/components/BalanceCard';
import CustomTokenDrawer from 'pages/components/CustomTokenDrawer';
import { useTranslation } from 'react-i18next';
import TokenList from '../Tokens';
import Activity from '../Activity/index';
import { Transaction } from '@portkey-wallet/types/types-ca/trade';
import NFT from '../NFT/NFT';
import {
  useAppDispatch,
  useUserInfo,
  useWalletInfo,
  useAssetInfo,
  useCommonState,
  useLoading,
} from 'store/Provider/hooks';
import {
  useCaAddresses,
  useCaAddressInfoList,
  useChainIdList,
  useCurrentWallet,
  useOriginChainId,
} from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { fetchAllTokenListAsync, getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { getCaHolderInfoAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import CustomTokenModal from 'pages/components/CustomTokenModal';
import { AccountAssetItem } from '@portkey-wallet/types/types-ca/token';
import { useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';
import useVerifierList from 'hooks/useVerifierList';
import useGuardianList from 'hooks/useGuardianList';
import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import AccountConnect from 'pages/components/AccountConnect';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import ChatEntry from 'pages/IMChat/ChatEntry';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useCheckSecurity } from 'hooks/useSecurity';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import DepositModal from '../DepositModal';
import DepositDrawer from '../DepositDrawer';
import { useExtensionBridgeButtonShow, useExtensionETransShow } from 'hooks/cms';
import { ETransType } from 'types/eTrans';
import DisclaimerModal, { IDisclaimerProps, initDisclaimerData } from '../../../components/DisclaimerModal';
import { stringifyETrans } from '@portkey-wallet/utils/dapp/url';
import './index.less';
import { useInitRamp, useRampEntryShow } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { setBadge } from 'utils/FCM';
import { useFCMEnable, useReportFCMStatus } from 'hooks/useFCM';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';
import { useLocationState, useNavigateState } from 'hooks/router';
import { TSendLocationState } from 'types/router';

export interface TransactionResult {
  total: number;
  items: Transaction[];
}

export type TMyBalanceState = {
  key?: string;
};

export default function MyBalance() {
  const { userInfo } = useWalletInfo();
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<string>(BalanceTab.TOKEN);
  const [navTarget, setNavTarget] = useState<'send' | 'receive'>('send');
  const [tokenOpen, setTokenOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const {
    accountToken: { accountTokenList },
    accountBalance,
  } = useAssetInfo();
  const navigate = useNavigateState<TSendLocationState>();
  const { state } = useLocationState<TMyBalanceState>();
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const caAddresses = useCaAddresses();
  const chainIdArray = useChainIdList();
  const isMainNet = useIsMainnet();
  const { walletInfo } = useCurrentWallet();
  const caAddressInfos = useCaAddressInfoList();
  const { eBridgeUrl = '', eTransferUrl = '' } = useCurrentNetworkInfo();
  const isFCMEnable = useFCMEnable();
  const { setLoading } = useLoading();

  const renderTabsData = useMemo(
    () => [
      {
        label: t('Tokens'),
        key: BalanceTab.TOKEN,
        children: <TokenList tokenList={accountTokenList} />,
      },
      {
        label: t('NFTs'),
        key: BalanceTab.NFT,
        children: <NFT />,
      },
      {
        label: t('Activity'),
        key: BalanceTab.ACTIVITY,
        children: <Activity />,
      },
    ],
    [accountTokenList, t],
  );
  const accountBalanceUSD = useAccountBalanceUSD();
  const getGuardianList = useGuardianList();
  useFreshTokenPrice();
  useVerifierList();
  const initRamp = useInitRamp({ clientType: 'Extension' });
  const { isRampShow } = useRampEntryShow();
  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
  const disclaimerData = useRef<IDisclaimerProps>(initDisclaimerData);
  const isShowChat = useIsChatShow();
  const unreadCount = useUnreadCount();
  const checkSecurity = useCheckSecurity();
  const originChainId = useOriginChainId();
  const { checkDappIsConfirmed } = useDisclaimer();
  const { isBridgeShow } = useExtensionBridgeButtonShow();
  const { isETransShow } = useExtensionETransShow();
  const reportFCMStatus = useReportFCMStatus();

  useEffect(() => {
    if (state?.key) {
      setActiveKey(state.key);
    }
    if (!passwordSeed) return;
    appDispatch(fetchTokenListAsync({ caAddresses, caAddressInfos }));
    appDispatch(fetchAllTokenListAsync({ keyword: '', chainIdArray }));
    appDispatch(getCaHolderInfoAsync());
    appDispatch(getSymbolImagesAsync());
  }, [passwordSeed, appDispatch, caAddresses, chainIdArray, caAddressInfos, isMainNet, state?.key, isRampShow]);

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
    (v: AccountAssetItem, type: 'token' | 'nft') => {
      setTokenOpen(false);
      const isNFT = type === 'nft';
      const state = {
        chainId: v.chainId,
        decimals: isNFT ? 0 : Number(v.tokenInfo?.decimals || 8),
        address: isNFT ? `${v?.nftInfo?.tokenContractAddress}` : `${v?.tokenInfo?.tokenContractAddress}`,
        symbol: v.symbol,
        name: v.symbol,
        imageUrl: isNFT ? v.nftInfo?.imageUrl : v.tokenInfo?.imageUrl,
        alias: isNFT ? v.nftInfo?.alias : '',
        tokenId: isNFT ? v.nftInfo?.tokenId : '',
      };
      navigate(`/${navTarget}/${type}/${v.symbol}`, { state });
    },
    [navTarget, navigate],
  );

  const { isNotLessThan768, isPrompt } = useCommonState();
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

  const handleBridge = useCallback(async () => {
    try {
      setLoading(true);
      const isSafe = await checkSecurity(originChainId);
      setLoading(false);
      if (!isSafe) return;
    } catch (error) {
      setLoading(false);
      console.log('===handleBridge error', error);
      return;
    }
    if (checkDappIsConfirmed(eBridgeUrl)) {
      const openWinder = window.open(eBridgeUrl, '_blank');
      if (openWinder) {
        openWinder.opener = null;
      }
      setDepositOpen(false);
    } else {
      disclaimerData.current = {
        targetUrl: eBridgeUrl,
        originUrl: eBridgeUrl,
        dappIcon: 'BridgeFavicon',
        originTitle: 'eBridge',
        titleText: 'You will be directed to a third-party DApp: eBridge',
      };
      setDisclaimerOpen(true);
    }
  }, [checkDappIsConfirmed, checkSecurity, eBridgeUrl, originChainId, setLoading]);

  useEffect(() => {
    if (!isFCMEnable()) return;
    reportFCMStatus();
    signalrFCM.signalr && setBadge({ value: unreadCount });
  }, [isFCMEnable, reportFCMStatus, unreadCount]);

  const handleClickETrans = useCallback(
    async (eTransType: ETransType) => {
      try {
        setLoading(true);
        const isSafe = await checkSecurity(originChainId);
        setLoading(false);
        if (!isSafe) return;
      } catch (error) {
        setLoading(false);
        console.log('===handleClickETrans error', error);
        return;
      }
      const targetUrl = stringifyETrans({
        url: eTransferUrl,
        query: {
          tokenSymbol: 'USDT',
          type: eTransType,
        },
      });
      if (checkDappIsConfirmed(eTransferUrl)) {
        const openWinder = window.open(targetUrl, '_blank');
        if (openWinder) {
          openWinder.opener = null;
        }
        setDepositOpen(false);
      } else {
        disclaimerData.current = {
          targetUrl,
          originUrl: eTransferUrl,
          dappIcon: 'ETransFavicon',
          originTitle: 'ETransfer',
          titleText: 'You will be directed to a third-party DApp: ETransfer',
        };
        setDisclaimerOpen(true);
      }
    },
    [checkDappIsConfirmed, checkSecurity, eTransferUrl, originChainId, setLoading],
  );

  const isShowDepositEntry = useMemo(
    () => isBridgeShow || isRampShow || isETransShow,
    [isBridgeShow, isRampShow, isETransShow],
  );

  const renderDeposit = useMemo(() => {
    if (!isShowDepositEntry) {
      return <></>;
    }
    const props = {
      open: depositOpen,
      onClose: () => setDepositOpen(false),
      onClickBridge: handleBridge,
      onClickETrans: handleClickETrans,
    };
    return isNotLessThan768 ? <DepositModal {...props} /> : <DepositDrawer {...props} />;
  }, [depositOpen, handleBridge, handleClickETrans, isNotLessThan768, isShowDepositEntry]);

  return (
    <div className="balance">
      {isShowChat && !isPrompt && (
        <div className="chat-body">
          <ChatEntry unread={unreadCount} />
        </div>
      )}
      <div className="wallet-name">
        {!isPrompt && <AccountConnect />}
        {userInfo?.nickName}
      </div>
      <div className="balance-amount">
        {isMainNet ? (
          <span className="amount">{`$ ${accountBalanceUSD}`}</span>
        ) : (
          <span className="dev-mode amount">Dev Mode</span>
        )}
      </div>
      <BalanceCard
        amount={accountBalance}
        isShowDeposit={isShowDepositEntry}
        onClickDeposit={() => setDepositOpen(true)}
        onSend={async () => {
          setNavTarget('send');
          return setTokenOpen(true);
        }}
        onReceive={() => {
          setNavTarget('receive');
          return setTokenOpen(true);
        }}
        isShowFaucet={!isMainNet}
      />
      {SelectTokenELe}
      <Tabs activeKey={activeKey} onChange={onChange} centered items={renderTabsData} className="balance-tab" />
      {isPrompt && <PromptEmptyElement className="empty-element" />}
      <DisclaimerModal
        open={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
        onCloseDepositModal={() => setDepositOpen(false)}
        {...disclaimerData.current}
      />
      {renderDeposit}
    </div>
  );
}
