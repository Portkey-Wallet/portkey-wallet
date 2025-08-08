import { useRoutes } from 'react-router';
import Home from 'pages/Home';
import Wallet from 'pages/Wallet';
import Contacts from 'pages/Contacts';
import AddToken from 'pages/Token/Manage';
import CustomToken from 'pages/Token/Custom';
import Receive from 'pages/Receive';
import TokenDetail from 'pages/Token/Detail';
import AccountSetting from 'pages/AccountSetting';
import My from 'pages/My';
import Send from 'pages/Send';
import NFT from 'pages/NFT';
import Collection from 'pages/Collection';
import Transaction from 'pages/Transaction';
import Unlock from 'pages/Unlock';
import ContactDetail from 'pages/Contacts/ContactDetail';
// import ConfirmPin from 'pages/AccountSetting/ConfirmPin';
import ConfirmPin from 'pages/My/SettingList/Security/ConfirmPin';
import SetNewPin from 'pages/My/SettingList/Security/SetNewPin';
import WalletSecurity from 'pages/WalletSecurity';
// import SetNewPin from 'pages/AccountSetting/SetNewPin';
import Devices from 'pages/WalletSecurity/ManageDevices/Devices';
import DeviceDetail from 'pages/WalletSecurity/ManageDevices/DeviceDetail';
import Buy from 'pages/Buy';
import BuyPreview from 'pages/Buy/Preview';
import AboutUs from 'pages/Wallet/AboutUs';
// import AutoLock from 'pages/Wallet/AutoLock';
import AutoLock from 'pages/My/SettingList/Security/AutoLock';
import SwitchNetworks from 'pages/Wallet/SwitchNetwork';
import WalletName from 'pages/Wallet/WalletName';
import MyQRCode from 'pages/MyQRCode';
import RecentDetail from 'pages/Send/components/RecentDetail';
import ConnectedSites from 'pages/WalletSecurity/ConnectedSites';
import SiteDetail from 'pages/WalletSecurity/ConnectedSites/SiteDetail';
import FindMore from 'pages/Contacts/FindMore';
import PaymentSecurity from 'pages/WalletSecurity/PaymentSecurity/PaymentSecurity';
import TransferSettings from 'pages/WalletSecurity/PaymentSecurity/TransferSettings';
import TransferSettingsEdit from 'pages/WalletSecurity/PaymentSecurity/TransferSettingsEdit';
import TradePage from 'pages/Trade';
import TokenAllowance from 'pages/WalletSecurity/TokenAllowance';
import TokenAllowanceDetail from 'pages/WalletSecurity/TokenAllowance/TokenAllowanceDetail';
import DepositHome from 'pages/DepositHome';
import ReceiveListPage from 'pages/Receive/ReceiveListPage';
import ReceiveCardPage from 'pages/Receive/ReceiveCardPage';
import CryptoGifts from 'pages/CryptoGifts/Home';
import HistoryList from 'pages/CryptoGifts/History';
import CryptoGiftsDetail from 'pages/CryptoGifts/Detail';
import FreeMint from 'pages/FreeMint';
import SecondaryMailbox from 'pages/WalletSecurity/SecondaryMailbox';
import SecondaryMailboxEdit from 'pages/WalletSecurity/SecondaryMailbox/Edit';
import SecondaryMailboxVerify from 'pages/WalletSecurity/SecondaryMailbox/Verify';
import Security from '../../pages/My/SettingList/Security';
import { SelectAssetListPage } from 'pages/Send/components/SelectAssetList';
import RampBuy from 'pages/Buy/RampBuy';
import RampSell from 'pages/Buy/RampSell';
import ActivityList from 'pages/Activity';
import { Swap } from 'pages/Swap';

export const PageRouter = () =>
  useRoutes([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/setting',
      element: <My />,
    },
    {
      path: '/setting/wallet',
      element: <Wallet />,
    },
    {
      path: '/setting/wallet/wallet-name',
      element: <WalletName />,
    },
    {
      path: '/setting/wallet/auto-lock',
      element: <AutoLock />,
    },
    {
      path: '/setting/wallet/switch-networks',
      element: <SwitchNetworks />,
    },
    {
      path: '/setting/wallet/about-us',
      element: <AboutUs />,
    },
    {
      path: '/setting/wallet/qrcode',
      element: <MyQRCode />,
    },
    {
      path: '/add-token',
      element: <AddToken />,
    },
    {
      path: '/custom-token',
      element: <CustomToken />,
    },
    {
      path: '/transaction',
      element: <Transaction />,
    },
    {
      path: '/token-detail',
      element: <TokenDetail />,
    },
    {
      path: '/select-asset',
      element: <SelectAssetListPage />,
    },
    {
      path: '/send/:type/:symbol',
      element: <Send />,
    },
    {
      path: '/recent-detail',
      element: <RecentDetail />,
    },
    {
      path: '/receive/:type/:symbol',
      element: <Receive />,
    },
    {
      path: '/buy',
      element: <Buy />,
    },
    {
      path: '/buy/ramp-buy',
      element: <RampBuy />,
    },
    {
      path: '/buy/ramp-sell',
      element: <RampSell />,
    },
    {
      path: '/buy/preview',
      element: <BuyPreview />,
    },
    {
      path: '/nft',
      element: <NFT />,
    },
    {
      path: '/collection',
      element: <Collection />,
    },
    {
      path: '/free-mint',
      element: <FreeMint />,
    },
    {
      path: 'setting/contacts',
      element: <Contacts />,
    },
    {
      path: '/setting/contacts/:type',
      element: <ContactDetail />,
    },
    {
      path: '/setting/contacts/:type/:extra',
      element: <ContactDetail />,
    },
    {
      path: '/setting/contacts/find-more',
      element: <FindMore />,
    },
    {
      path: '/setting/contacts/qrcode',
      element: <MyQRCode />,
    },
    {
      path: '/setting/account-setting',
      element: <AccountSetting />,
    },
    {
      path: '/setting/account-setting/confirm-pin',
      element: <ConfirmPin />,
    },
    {
      path: '/setting/account-setting/set-new-pin',
      element: <SetNewPin />,
    },
    // Revamp security
    {
      path: '/setting/security',
      element: <Security />,
    },
    {
      path: '/setting/security/auto-lock',
      element: <AutoLock />,
    },
    {
      path: '/setting/security/confirm-pin',
      element: <ConfirmPin />,
    },
    {
      path: '/setting/security/set-new-pin',
      element: <SetNewPin />,
    },
    // Revamp security end
    {
      path: '/setting/wallet/auto-lock',
      element: <AutoLock />,
    },
    {
      path: '/setting/wallet-security',
      element: <WalletSecurity />,
    },
    {
      path: '/setting/wallet-security/manage-devices',
      element: <Devices />,
    },
    {
      path: '/setting/wallet-security/manage-devices/:managerAddress',
      element: <DeviceDetail />,
    },
    {
      path: '/setting/wallet-security/connected-sites',
      element: <ConnectedSites />,
    },
    {
      path: '/setting/wallet-security/connected-sites/:origin',
      element: <SiteDetail />,
    },
    {
      path: '/setting/wallet-security/payment-security',
      element: <PaymentSecurity />,
    },
    {
      path: '/setting/wallet-security/payment-security/transfer-settings',
      element: <TransferSettings />,
    },
    {
      path: '/setting/wallet-security/payment-security/transfer-settings-edit',
      element: <TransferSettingsEdit />,
    },
    {
      path: '/setting/wallet-security/token-allowance',
      element: <TokenAllowance />,
    },
    {
      path: '/setting/wallet-security/token-allowance-detail',
      element: <TokenAllowanceDetail />,
    },
    {
      path: '/setting/wallet-security/secondary-mailbox',
      element: <SecondaryMailbox />,
    },
    {
      path: '/setting/wallet-security/secondary-mailbox-edit',
      element: <SecondaryMailboxEdit />,
    },
    {
      path: '/setting/wallet-security/secondary-mailbox-verify',
      element: <SecondaryMailboxVerify />,
    },
    {
      path: '/activity-list',
      element: <ActivityList />,
    },
    {
      path: '/trade',
      element: <TradePage />,
    },
    {
      path: '/unlock',
      element: <Unlock />,
    },
    {
      path: '/crypto-gifts',
      element: <CryptoGifts />,
    },
    {
      path: '/crypto-gifts/history',
      element: <HistoryList />,
    },
    {
      path: '/crypto-gifts/detail',
      element: <CryptoGiftsDetail />,
    },
    {
      path: '/swap',
      element: <Swap />,
    },
    {
      path: '*',
      element: <Home />,
    },
    {
      path: '/token-detail/deposit-home/:chain/:symbol',
      element: <DepositHome />,
    },
    {
      path: '/receive-list',
      element: <ReceiveListPage />,
    },
    {
      path: '/receive-card',
      element: <ReceiveCardPage />,
    },
  ]);
