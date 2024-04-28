import { useRoutes } from 'react-router';
import Home from 'pages/Home';
import Wallet from 'pages/Wallet';
import Contacts from 'pages/Contacts';
import GuardianApproval from 'pages/GuardianApproval';
import AddToken from 'pages/Token/Manage';
import CustomToken from 'pages/Token/Custom';
import Receive from 'pages/Receive';
import TokenDetail from 'pages/Token/Detail';
import AccountSetting from 'pages/AccountSetting';
import My from 'pages/My';
import Send from 'pages/Send';
import NFT from 'pages/NFT';
import Transaction from 'pages/Transaction';
import Guardians from 'pages/Guardians';
import AddGuardian from 'pages/Guardians/GuardiansAdd';
import GuardiansEdit from 'pages/Guardians/GuardiansEdit';
import GuardiansView from 'pages/Guardians/GuardiansView';
import VerifierAccount from 'pages/VerifierAccount';
import Unlock from 'pages/Unlock';
import ContactDetail from 'pages/Contacts/ContactDetail';
import ConfirmPin from 'pages/AccountSetting/ConfirmPin';
import WalletSecurity from 'pages/WalletSecurity';
import SetNewPin from 'pages/AccountSetting/SetNewPin';
import Devices from 'pages/WalletSecurity/ManageDevices/Devices';
import DeviceDetail from 'pages/WalletSecurity/ManageDevices/DeviceDetail';
import Buy from 'pages/Buy';
import BuyPreview from 'pages/Buy/Preview';
import AboutUs from 'pages/Wallet/AboutUs';
import AutoLock from 'pages/Wallet/AutoLock';
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
import ChatList from 'pages/IMChat/ChatList';
import ChatBox from 'pages/IMChat/ChatBox';
import NewChat from 'pages/IMChat/NewChat';
import ChatListSearch from 'pages/IMChat/ChatListSearch';
import CreateChatGroup from 'pages/IMChat/CreateChatGroup';
import GroupInfo from 'pages/IMChat/GroupInfo';
import EditGroupInfo from 'pages/IMChat/EditGroupInfo';
import TransferOwnership from 'pages/IMChat/TransferOwnership';
import MemberList from 'pages/IMChat/MemberList';
import HandleMember from 'pages/IMChat/HandleMember';
import ChatPrivacy from 'pages/AccountSetting/ChatPrivacy';
import ChatPrivacyEdit from 'pages/AccountSetting/ChatPrivacyEdit';
import GroupQRCode from 'pages/IMChat/GroupQRCode';
import PinnedMsg from 'pages/IMChat/PinnedMsgPage';
import TradePage from 'pages/Trade';

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
    {
      path: '/setting/account-setting/chat-privacy',
      element: <ChatPrivacy />,
    },
    {
      path: '/setting/account-setting/chat-privacy-edit',
      element: <ChatPrivacyEdit />,
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
      path: '/setting/wallet-security/payment-security/guardian-approval',
      element: <GuardianApproval />,
    },
    {
      path: '/chat-list',
      element: <ChatList />,
    },
    {
      path: '/chat-list-search',
      element: <ChatListSearch />,
    },
    {
      path: '/chat-box/:channelUuid',
      element: <ChatBox />,
    },
    {
      path: '/chat-box-group/:channelUuid',
      element: <ChatBox />,
    },
    {
      path: '/chat-box-group/:channelUuid/pinned-msg',
      element: <PinnedMsg />,
    },
    {
      path: '/chat-group-info/:channelUuid',
      element: <GroupInfo />,
    },
    {
      path: '/chat-group-info/:channelUuid/edit',
      element: <EditGroupInfo />,
    },
    {
      path: '/chat-group-info/:channelUuid/transfer-ownership',
      element: <TransferOwnership />,
    },
    {
      path: '/chat-group-info/:channelUuid/member-list',
      element: <MemberList />,
    },
    {
      path: '/chat-group-info/:channelUuid/member-list/:operate',
      element: <HandleMember />,
    },
    {
      path: '/chat-group-info/:channelUuid/share',
      element: <GroupQRCode />,
    },
    {
      path: '/new-chat',
      element: <NewChat />,
    },
    {
      path: '/trade',
      element: <TradePage />,
    },
    {
      path: '/create-chat-group',
      element: <CreateChatGroup />,
    },
    {
      path: '/unlock',
      element: <Unlock />,
    },
    {
      path: '*',
      element: <Home />,
    },
  ]);
