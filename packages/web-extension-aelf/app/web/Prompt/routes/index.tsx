import { useRoutes } from 'react-router-dom';
import ScreenOpeningPage from 'pages/ScreenOpening';
import VerifierAccount from 'pages/VerifierAccount';
import SetWalletPin from 'pages/SetWalletPin';
import SetPin from 'pages/SetPin';
import SuccessPage from 'pages/SuccessPage';
import Unlock from 'pages/Unlock';
import QueryPage from 'pages/QueryPage';
// import ConfirmPin from 'pages/AccountSetting/ConfirmPin';
import ConfirmPin from 'pages/My/SettingList/Security/ConfirmPin';
import SetNewPin from 'pages/My/SettingList/Security/SetNewPin';
import NotFound from 'pages/NotFound';
// import Example from 'pages/Example';
// import SignUpUI from 'pages/Example/SignUpUI';
// import Login from 'pages/Example/login';
// import TestSocket from 'pages/TestSocket';
import Home from 'pages/Home';
import AddToken from 'pages/Token/Manage';
import CustomToken from 'pages/Token/Custom';
import Transaction from 'pages/Transaction';
import TokenDetail from 'pages/Token/Detail';
import Send from 'pages/Send';
import Receive from 'pages/Receive';
import NFT from 'pages/NFT';
import Collection from 'pages/Collection';
import ContactDetail from 'pages/Contacts/ContactDetail';
import AccountSetting from 'pages/AccountSetting';
// import PromptMy from 'pages/PromptMy';
import Wallet from 'pages/Wallet';
import Contacts from 'pages/Contacts';
import WalletSecurity from 'pages/WalletSecurity';
// import SetNewPin from 'pages/AccountSetting/SetNewPin';
import AboutUs from 'pages/Wallet/AboutUs';
// import AutoLock from 'pages/Wallet/AutoLock';
import AutoLock from 'pages/My/SettingList/Security/AutoLock';
import SwitchNetworks from 'pages/Wallet/SwitchNetwork';
import WalletName from 'pages/Wallet/WalletName';
import MyQRCode from 'pages/MyQRCode';
import Devices from 'pages/WalletSecurity/ManageDevices/Devices';
import DeviceDetail from 'pages/WalletSecurity/ManageDevices/DeviceDetail';
// import Buy from 'pages/Buy';
// import BuyPreview from 'pages/Buy/Preview';
// import { useCommonState } from 'store/Provider/hooks';
import My from 'pages/My';
import RecentDetail from 'pages/Send/components/RecentDetail';
import Permission from 'pages/Permission';
import ConnectWallet from 'pages/ConnectWallet';
import ConnectedSites from 'pages/WalletSecurity/ConnectedSites';
import SiteDetail from 'pages/WalletSecurity/ConnectedSites/SiteDetail';
// import SendTransactions from 'pages/SendTransactions';
import GetSignature from 'pages/GetSignature';
import DappAutoTx from 'pages/DappAutoTx';
import FindMore from 'pages/Contacts/FindMore';
import PaymentSecurity from 'pages/WalletSecurity/PaymentSecurity/PaymentSecurity';
import TransferSettings from 'pages/WalletSecurity/PaymentSecurity/TransferSettings';
import TransferSettingsEdit from 'pages/WalletSecurity/PaymentSecurity/TransferSettingsEdit';
import AllowanceApprove from 'pages/AllowanceApprove';
import WalletSecurityApprove from 'pages/WalletSecurityApprove';
// import ChatPrivacy from 'pages/AccountSetting/ChatPrivacy';
// import ChatPrivacyEdit from 'pages/AccountSetting/ChatPrivacyEdit';
import AccountCancelation from 'pages/Wallet/AccountCancelation';
import VerifyAccountCancelation from 'pages/Wallet/VerifyAccountCancelation';
import TokenAllowance from 'pages/WalletSecurity/TokenAllowance';
import TokenAllowanceDetail from 'pages/WalletSecurity/TokenAllowance/TokenAllowanceDetail';
import DepositHome from 'pages/DepositHome';
import SelectNetwork from 'pages/DepositHome/components/SelectNetwork';
import CryptoGifts from 'pages/CryptoGifts/Home';
import HistoryList from 'pages/CryptoGifts/History';
import CryptoGiftsDetail from 'pages/CryptoGifts/Detail';
import Create from 'pages/CryptoGifts/Create';
import Success from 'pages/CryptoGifts/Success';
import FreeMint from 'pages/FreeMint';
import SecondaryMailbox from 'pages/WalletSecurity/SecondaryMailbox';
import SecondaryMailboxEdit from 'pages/WalletSecurity/SecondaryMailbox/Edit';
import SecondaryMailboxVerify from 'pages/WalletSecurity/SecondaryMailbox/Verify';
import Security from '../../pages/My/SettingList/Security';
import { PrepareWallet } from 'pages/PrepareWallet';
import CreateNewWallet from 'pages/CreateNewWallet';
import { SelectAssetListPage } from 'pages/Send/components/SelectAssetList';
import ReceiveListPage from 'pages/Receive/ReceiveListPage';
import ReceiveCardPage from 'pages/Receive/ReceiveCardPage';
// import RampBuy from 'pages/Buy/RampBuy';
// import RampSell from 'pages/Buy/RampSell';
import { Swap } from 'pages/Swap';
import Example from 'pages/Example';
// import TokenNetworkList from 'pages/DepositHome/components/TokenNetworkList';
import { ManualBackup } from 'pages/WalletBackup/ManualBackup/index';
import { ManualBackupSuccess } from 'pages/WalletBackup/ManualBackup/Success';
import { ConfirmBackup } from 'pages/WalletBackup/ConfirmBackup/ConfirmBackup';
import { ImportWallet } from 'pages/WalletManage/WalletImport/ImportWallet';
import { WalletManagement } from 'pages/WalletManage/WalletManagement/index';
import { ResetApp } from 'pages/WalletManage/WalletManagement/ResetApp';
import { AddressBackup } from 'pages/WalletManage/WalletManagement/AddressBackup';
import AddressDetail from 'pages/WalletManage/WalletManagement/AddressDetail';

// 2025-06-05
export const PageRouter = () => {
  // const { isNotLessThan768 } = useCommonState();

  const commonRoutes = [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/register',
      element: <ScreenOpeningPage />,
    },
    // {
    //   path: '/register/start',
    //   element: <RegisterStart />,
    // },
    // {
    //   path: '/register/start/:type',
    //   element: <RegisterStart />,
    // },
    {
      path: '/register/verifier-account',
      element: <VerifierAccount />,
    },
    {
      path: '/login/set-pin/:type',
      element: <SetWalletPin />,
    },
    {
      path: '/pin/set',
      element: <SetPin />,
    },
    {
      path: '/success-page/:type',
      element: <SuccessPage />,
    },
    {
      path: '/wallet/manage',
      element: <WalletManagement />,
    },
    {
      path: '/wallet/create',
      element: <CreateNewWallet />,
    },
    {
      path: '/wallet/reset',
      element: <ResetApp />,
    },
    {
      path: '/wallet/import',
      element: <ImportWallet />,
    },
    {
      path: '/wallet/backup/manual',
      element: <ManualBackup />,
    },
    {
      path: '/wallet/backup/manual/success',
      element: <ManualBackupSuccess />,
    },
    {
      path: '/wallet/backup/manual/confirm',
      element: <ConfirmBackup />,
    },
    {
      path: '/wallet/backup/view',
      element: <AddressBackup />,
    },
    {
      path: '/wallet/address/detail',
      element: <AddressDetail />,
    },
    {
      path: '/prepare-wallet/:type',
      element: <PrepareWallet />,
    },
    {
      path: '/login/verifier-account',
      element: <VerifierAccount />,
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
      // element: <Buy />,
      element: <>Buy TODO</>,
    },
    {
      path: '/buy/ramp-buy',
      // element: <RampBuy />,
      element: <>RampBuy TODO</>,
    },
    {
      path: '/buy/ramp-sell',
      // element: <RampSell />,
      element: <>RampSell TODO</>,
    },
    {
      path: '/buy/preview',
      // element: <BuyPreview />,
      element: <>BuyPreview TODO</>,
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
      path: '/unlock',
      element: <Unlock />,
    },
    {
      path: 'query-page',
      element: <QueryPage />,
    },
    {
      path: '/permission',
      element: <Permission />,
    },
    {
      path: '/test',
      element: <Example />,
    },
    // {
    //   path: '/test/example-SignUpUI',
    //   element: <SignUpUI />,
    // },

    // {
    //   path: '/test/example-login',
    //   element: <Login />,
    // },

    // {
    //   path: '/test/socket',
    //   element: <TestSocket />,
    // },
    {
      path: '/connect-wallet',
      element: <ConnectWallet />,
    },
    {
      path: '/send-transactions',
      // element: <SendTransactions />,
      element: <>SendTransactions TODO 0605</>,
    },
    {
      path: '/get-signature',
      element: <GetSignature />,
    },
    {
      path: '/auto-execute-tx',
      element: <DappAutoTx />,
    },
    {
      path: '/allowance-approve',
      element: <AllowanceApprove />,
    },
    {
      path: '/approve-wallet-security',
      element: <WalletSecurityApprove />,
    },
    {
      path: '/crypto-gifts',
      element: <CryptoGifts />,
    },
    {
      path: '/crypto-gifts/create',
      element: <Create />,
    },
    {
      path: '/crypto-gifts/success',
      element: <Success />,
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
      element: <NotFound />,
    },
    {
      path: '/token-detail/deposit-home/:chain/:symbol',
      element: <DepositHome />,
    },
    {
      path: '/token-detail/deposit-home/select-network',
      element: <SelectNetwork />,
    },
  ];

  const settingPopupRoutes = [
    {
      path: '/setting',
      element: <My />,
    },
    {
      path: '/setting/guardians/verifier-account',
      element: <VerifierAccount />,
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
      path: '/setting/wallet/account-cancelation',
      element: <AccountCancelation />,
    },
    {
      path: '/setting/wallet/account-cancelation-code',
      element: <VerifyAccountCancelation />,
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
      path: '/setting/contacts',
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
    // {
    //   path: '/setting/account-setting/chat-privacy',
    //   element: <ChatPrivacy />,
    // },
    // {
    //   path: '/setting/account-setting/chat-privacy-edit',
    //   element: <ChatPrivacyEdit />,
    // },
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
    // Transaction Limits
    {
      path: '/setting/transaction-limits',
      element: <SetNewPin />,
    },
    // Revamp Transaction Limits end
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
      path: '/setting/wallet-security/manage-devices/verifier-account',
      element: <VerifierAccount />,
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
      path: '/setting/wallet-security/payment-security/verifier-account',
      element: <VerifierAccount />,
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
      path: '/receive-list',
      element: <ReceiveListPage />,
    },
    {
      path: '/receive-card',
      element: <ReceiveCardPage />,
    },
  ];
  // const promptRoutes = useRoutes([...commonRoutes, ...settingPromptRoutes]);
  // const popupRoutes = useRoutes([...commonRoutes, ...settingPopupRoutes]);
  //
  // return isNotLessThan768 ? promptRoutes : popupRoutes;
  return useRoutes([...commonRoutes, ...settingPopupRoutes]);
};
