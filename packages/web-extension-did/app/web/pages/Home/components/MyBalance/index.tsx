import { useCallback, useEffect, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import BalanceCard from 'pages/components/BalanceCard';
import CustomTokenDrawer from 'pages/components/CustomTokenDrawer';
import { useTranslation } from 'react-i18next';
import TokenList from '../Tokens';
import Activity from '../Activity/index';
import { Transaction } from '@portkey-wallet/types/types-ca/trade';
import NFT from '../NFT/NFT';
import { useAppDispatch, useUserInfo, useWalletInfo, useAssetInfo, useCommonState } from 'store/Provider/hooks';
import {
  useCaAddresses,
  useCaAddressInfoList,
  useChainIdList,
  useCurrentWallet,
} from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchTokenListAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { fetchAllTokenListAsync, getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { getCaHolderInfoAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import CustomTokenModal from 'pages/components/CustomTokenModal';
import { AccountAssetItem } from '@portkey-wallet/types/types-ca/token';
import { fetchBuyFiatListAsync, fetchSellFiatListAsync } from '@portkey-wallet/store/store-ca/payment/actions';
import { useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { useAccountBalanceUSD } from '@portkey-wallet/hooks/hooks-ca/balances';
import useVerifierList from 'hooks/useVerifierList';
import useGuardianList from 'hooks/useGuardianList';
import { FAUCET_URL } from '@portkey-wallet/constants/constants-ca/payment';
import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import AccountConnect from 'pages/components/AccountConnect';
import { useBuyButtonShow, useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import ChatEntry from 'pages/ChatEntry';
import { useUnreadCount } from '@portkey-wallet/hooks/hooks-ca/im';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import './index.less';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { useCheckSecurity } from 'hooks/useSecurity';

export interface TransactionResult {
  total: number;
  items: Transaction[];
}

export default function MyBalance() {
  const { walletName } = useWalletInfo();
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<string>(BalanceTab.TOKEN);
  const [navTarget, setNavTarget] = useState<'send' | 'receive'>('send');
  const [tokenOpen, setTokenOpen] = useState(false);
  const {
    accountToken: { accountTokenList },
    accountBalance,
  } = useAssetInfo();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const caAddresses = useCaAddresses();
  const chainIdArray = useChainIdList();
  const isMainNet = useIsMainnet();
  const { walletInfo } = useCurrentWallet();
  const caAddressInfos = useCaAddressInfoList();
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
  const { isBuyButtonShow } = useBuyButtonShow(VersionDeviceType.Extension);
  const isShowChat = useIsChatShow();
  const unreadCount = useUnreadCount();
  const checkSecurity = useCheckSecurity();

  useEffect(() => {
    if (state?.key) {
      setActiveKey(state.key);
    }
    if (!passwordSeed) return;
    appDispatch(fetchTokenListAsync({ caAddresses, caAddressInfos }));
    appDispatch(fetchAllTokenListAsync({ keyword: '', chainIdArray }));
    appDispatch(getCaHolderInfoAsync());
    appDispatch(getSymbolImagesAsync());
  }, [passwordSeed, appDispatch, caAddresses, chainIdArray, caAddressInfos, isMainNet, state?.key]);

  useEffect(() => {
    getGuardianList({ caHash: walletInfo?.caHash });
    isMainNet && appDispatch(fetchBuyFiatListAsync());
    isMainNet && appDispatch(fetchSellFiatListAsync());
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
        decimals: isNFT ? 0 : v.tokenInfo?.decimals,
        address: isNFT ? v?.nftInfo?.tokenContractAddress : v?.tokenInfo?.tokenContractAddress,
        symbol: v.symbol,
        name: v.symbol,
        imageUrl: isNFT ? v.nftInfo?.imageUrl : '',
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

  const handleBuy = useCallback(() => {
    if (isMainNet) {
      navigate('/buy');
    } else {
      const openWinder = window.open(FAUCET_URL, '_blank');
      if (openWinder) {
        openWinder.opener = null;
      }
    }
  }, [isMainNet, navigate]);

  return (
    <div className="balance">
      {isShowChat && !isPrompt && (
        <div className="chat-body">
          <ChatEntry unread={unreadCount} />
        </div>
      )}
      <div className="wallet-name">
        {!isPrompt && <AccountConnect />}
        {walletName}
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
        isShowBuy={isBuyButtonShow}
        onBuy={handleBuy}
        onSend={async () => {
          const res = await checkSecurity();
          if (typeof res === 'boolean') {
            setNavTarget('send');
            return setTokenOpen(true);
          }
        }}
        onReceive={() => {
          setNavTarget('receive');
          return setTokenOpen(true);
        }}
      />
      {SelectTokenELe}
      <Tabs activeKey={activeKey} onChange={onChange} centered items={renderTabsData} className="balance-tab" />
      {isPrompt ? <PromptEmptyElement className="empty-element" /> : null}
    </div>
  );
}
