import RegisterStart from 'pages/RegisterStart';
import SelectVerifier from 'pages/SelectVerifier';
import { useRoutes } from 'react-router-dom';
import ScreenOpeningPage from 'pages/ScreenOpening';
import VerifierAccount from 'pages/VerifierAccount';
import SetWalletPin from 'pages/SetWalletPin';
import SuccessPage from 'pages/SuccessPage';
import GuardianApproval from 'pages/GuardianApproval';
import Unlock from 'pages/Unlock';
import QueryPage from 'pages/QueryPage';
import TestSocket from 'pages/TestSocket';
import ConfirmPin from 'pages/AccountSetting/ConfirmPin';
import NotFound from 'pages/NotFound';
import Example from 'pages/Example';
import SignUpUI from 'pages/Example/SignUpUI';
import Login from 'pages/Example/login';
import Home from 'pages/Home';
import AddGuardian from 'pages/Guardians/GuardiansAdd';
import GuardiansEdit from 'pages/Guardians/GuardiansEdit';
import GuardiansView from 'pages/Guardians/GuardiansView';
import AddToken from 'pages/Token/Manage';
import Transaction from 'pages/Transaction';
import TokenDetail from 'pages/Token/Detail';
import Send from 'pages/Send';
import Receive from 'pages/Receive';
import NFT from 'pages/NFT';
import Contact from 'pages/Contacts/ContactDetail';
import AccountSetting from 'pages/AccountSetting';
import PromptMy from 'pages/PromptMy';
import Guardians from 'pages/Guardians';
import Wallet from 'pages/Wallet';
import Contacts from 'pages/Contacts';
import WalletSecurity from 'pages/WalletSecurity';
import SetNewPin from 'pages/AccountSetting/SetNewPin';
import AboutUs from 'pages/Wallet/AboutUs';
import AutoLock from 'pages/Wallet/AutoLock';
import SwitchNetworks from 'pages/Wallet/SwitchNetwork';
import WalletName from 'pages/Wallet/WalletName';
import Devices from 'pages/WalletSecurity/ManageDevices/Devices';
import DeviceDetail from 'pages/WalletSecurity/ManageDevices/DeviceDetail';
import Buy from 'pages/Buy';
import BuyPreview from 'pages/Buy/Preview';
import { useCommonState } from 'store/Provider/hooks';
import My from 'pages/My';
import RecentDetail from 'pages/Send/components/RecentDetail';
import Permission from 'pages/Permission';
import ConnectWallet from 'pages/ConnectWallet';
import ConnectedSites from 'pages/WalletSecurity/ConnectedSites';
import SendTransactions from 'pages/SendTransactions';
import GetSignature from 'pages/GetSignature';

export const PageRouter = () => {
  const { isNotLessThan768 } = useCommonState();

  const commonRoutes = [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/register',
      element: <ScreenOpeningPage />,
    },
    {
      path: '/register/start',
      element: <RegisterStart />,
    },
    {
      path: '/register/start/:type',
      element: <RegisterStart />,
    },
    {
      path: '/register/select-verifier',
      element: <SelectVerifier />,
    },
    {
      path: '/register/verifier-account',
      element: <VerifierAccount />,
    },
    {
      path: '/login/set-pin/:type',
      element: <SetWalletPin />,
    },
    {
      path: '/success-page/:type',
      element: <SuccessPage />,
    },
    {
      path: '/login/guardian-approval',
      element: <GuardianApproval />,
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
      path: '/transaction',
      element: <Transaction />,
    },
    {
      path: '/token-detail',
      element: <TokenDetail />,
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
      path: '/buy/preview',
      element: <BuyPreview />,
    },
    {
      path: '/nft',
      element: <NFT />,
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
    {
      path: '/test/example-SignUpUI',
      element: <SignUpUI />,
    },

    {
      path: '/test/example-login',
      element: <Login />,
    },

    {
      path: '/test/socket',
      element: <TestSocket />,
    },
    {
      path: '/connect-wallet',
      element: <ConnectWallet />,
    },
    {
      path: '/send-transactions',
      element: <SendTransactions />,
    },
    {
      path: '/get-signature',
      element: <GetSignature />,
    },

    {
      path: '*',
      element: <NotFound />,
    },
  ];
  const settingPromptRoutes = [
    {
      path: '/setting',
      element: <PromptMy />,
      children: [
        {
          path: '/setting/wallet',
          element: <Wallet />,
          children: [
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
          ],
        },
        {
          path: '/setting/contacts',
          element: <Contacts />,
          children: [
            {
              path: '/setting/contacts/:type',
              element: <Contact />,
            },
          ],
        },
        {
          path: '/setting/account-setting',
          element: <AccountSetting />,
          children: [
            {
              path: '/setting/account-setting/confirm-pin',
              element: <ConfirmPin />,
            },
            {
              path: '/setting/account-setting/set-new-pin',
              element: <SetNewPin />,
            },
          ],
        },
        {
          path: '/setting/guardians',
          element: <Guardians />,
          children: [
            {
              path: '/setting/guardians/add',
              element: <AddGuardian />,
            },
            {
              path: '/setting/guardians/edit',
              element: <GuardiansEdit />,
            },
            {
              path: '/setting/guardians/view',
              element: <GuardiansView />,
            },
            {
              path: '/setting/guardians/verifier-account',
              element: <VerifierAccount />,
            },
            {
              path: '/setting/guardians/guardian-approval',
              element: <GuardianApproval />,
            },
          ],
        },
        {
          path: '/setting/wallet-security',
          element: <WalletSecurity />,
          children: [
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
              path: '/setting/wallet-security/manage-devices/guardian-approval',
              element: <GuardianApproval />,
            },
            {
              path: '/setting/wallet-security/connected-sites',
              element: <ConnectedSites />,
            },
          ],
        },
      ],
    },
  ];
  const settingPopupRoutes = [
    {
      path: '/setting',
      element: <My />,
    },
    {
      path: '/setting/guardians',
      element: <Guardians />,
    },
    {
      path: '/setting/guardians/add',
      element: <AddGuardian />,
    },
    {
      path: '/setting/guardians/edit',
      element: <GuardiansEdit />,
    },
    {
      path: '/setting/guardians/view',
      element: <GuardiansView />,
    },
    {
      path: '/setting/guardians/verifier-account',
      element: <VerifierAccount />,
    },
    {
      path: '/setting/guardians/guardian-approval',
      element: <GuardianApproval />,
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
      path: '/setting/contacts',
      element: <Contacts />,
    },
    {
      path: '/setting/contacts/:type',
      element: <Contact />,
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
      path: '/setting/wallet-security/manage-devices/guardian-approval',
      element: <GuardianApproval />,
    },
    {
      path: '/setting/wallet-security/connected-sites',
      element: <ConnectedSites />,
    },
  ];

  const promptRoutes = useRoutes([...commonRoutes, ...settingPromptRoutes]);
  const popupRoutes = useRoutes([...commonRoutes, ...settingPopupRoutes]);

  return isNotLessThan768 ? promptRoutes : popupRoutes;
};
