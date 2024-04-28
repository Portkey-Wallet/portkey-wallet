// import SelectCountryPage from 'pages/Entries/SelectCountry';
import { PortkeyEntries, registerLaunchMode } from '@portkey-wallet/rn-core/router/types';
import { AppRegistry, ComponentProvider } from 'react-native';
import { wrapEntry } from 'utils/commonUtil';
import TestEntry from 'apiTest/TestEntry';
import { PortkeyTestEntries } from 'apiTest';
import ReduxProvider from './ReduxProvider';
import React from 'react';
import TestComp from 'apiTest/TestComp';
import Biometric from 'pages/My/Biometric';
import AccountSettings from 'pages/My/AccountSettings';
import GuardianHome from '@portkey-wallet/rn-biz-components/biz-components/My/Guardian/GuardianHome';
import AddGuardian from '@portkey-wallet/rn-biz-components/biz-components/My/Guardian/GuardianEdit';
import GuardianDetail from '@portkey-wallet/rn-biz-components/biz-components/My/Guardian/GuardianDetail';
import LogInPortKey from '@portkey-wallet/rn-biz-components/biz-components/Login/LoginPortkey';
import SignupPortkey from '@portkey-wallet/rn-biz-components/biz-components/Login/SignupPortkey';
import ScanLogin from '@portkey-wallet/rn-biz-components/biz-components/Login/ScanLogin';
import CheckPin from '@portkey-wallet/rn-biz-components/biz-components/Pin/CheckPin';
import ConfirmPin from '@portkey-wallet/rn-biz-components/biz-components/Pin/ConfirmPin';
import SetBiometrics from '@portkey-wallet/rn-biz-components/biz-components/Pin/SetBiometrics';
import SetPin from '@portkey-wallet/rn-biz-components/biz-components/Pin/SetPin';
import GuardianApproval from '@portkey-wallet/rn-biz-components/biz-components/Guardian/GuardianApproval';
import VerifierDetails from '@portkey-wallet/rn-biz-components/biz-components/Guardian/VerifierDetails';
import DashBoard from '@portkey-wallet/rn-biz-components/biz-components/DashBoard';
import SecurityLock from '@portkey-wallet/rn-biz-components/biz-components/SecurityLock';
import Receive from '@portkey-wallet/rn-biz-components/biz-components/Receive';
import ActivityListPage from '@portkey-wallet/rn-biz-components/biz-components/Activity/ActivityListPage';
import ActivityDetail from '@portkey-wallet/rn-biz-components/biz-components/Activity/ActivityDetail';
import ViewOnWebView from '@portkey-wallet/rn-biz-components/biz-components/Activity/ViewOnWebView';
import SendHome from '@portkey-wallet/rn-biz-components/biz-components/Send/SendHome';
import SendPreview from '@portkey-wallet/rn-biz-components/biz-components/Send/SendPreview';
import ManageTokenList from '@portkey-wallet/rn-biz-components/biz-components/Token/ManageTokenList';
import CustomToken from '@portkey-wallet/rn-biz-components/biz-components/Token/CustomToken';
import TokenDetail from '@portkey-wallet/rn-biz-components/biz-components/Token/TokenDetail';
import NFTDetail from '@portkey-wallet/rn-biz-components/biz-components/NFT/NFTDetail';
import RampHome from '@portkey-wallet/rn-biz-components/biz-components/Ramp/RampHome';
import RampPreview from '@portkey-wallet/rn-biz-components/biz-components/Ramp/RampPreview';
import PaymentSecurityList from '@portkey-wallet/rn-biz-components/biz-components/WalletSecurity/PaymentSecurity/index';
import PaymentSecurityDetail from '@portkey-wallet/rn-biz-components/biz-components/WalletSecurity/PaymentSecurity/PaymentSecurityDetail';
import PaymentSecurityEdit from '@portkey-wallet/rn-biz-components/biz-components/WalletSecurity/PaymentSecurity/PaymentSecurityEdit';
import ContactActivity from '@portkey-wallet/rn-biz-components/biz-components/My/ContactActivity';
import QrScanner from '@portkey-wallet/rn-biz-components/biz-components/QrCode/QrScanner';
import QrCodeResult from '@portkey-wallet/rn-biz-components/biz-components/QrCode/QrCodeResult';
import EndPointChange from 'apiTest/EndPointChange';

type AcceptableComponentType = ComponentProvider;

const initEntries = () => {
  const entryConfig = new Map<string, AcceptableComponentType>();
  if (__DEV__) {
    // test only
    // entryConfig.set(PortkeyTestEntries.TEST, () => TestEntry);
    entryConfig.set(PortkeyTestEntries.TEST, () => ReduxProvider(TestEntry));
  }
  entryConfig.set(PortkeyTestEntries.ENDPOINT_CHANGE_ENTRY, () =>
    ReduxProvider(EndPointChange as React.ComponentType<any>, {
      routerParams: {
        from: PortkeyTestEntries.ENDPOINT_CHANGE_ENTRY,
      },
    }),
  );
  // entry stage
  entryConfig.set(PortkeyEntries.SIGN_IN_ENTRY, () =>
    ReduxProvider(LogInPortKey as React.ComponentType<any>, {
      routerParams: {
        from: PortkeyEntries.SIGN_IN_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.SIGN_UP_ENTRY, () =>
    ReduxProvider(SignupPortkey as React.ComponentType<any>, {
      routerParams: {
        from: PortkeyEntries.SIGN_UP_ENTRY,
      },
    }),
  );
  // entryConfig.set(PortkeyEntries.SELECT_COUNTRY_ENTRY, () => SelectCountryPage);

  // verify stage VerifierDetails
  entryConfig.set(PortkeyEntries.VERIFIER_DETAIL_ENTRY, () =>
    ReduxProvider(VerifierDetails as React.ComponentType<any>, {
      routerParams: {
        from: PortkeyEntries.VERIFIER_DETAIL_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.SECURITY_LOCK_ENTRY, () =>
    ReduxProvider(SecurityLock as React.ComponentType<any>, {
      routerParams: {
        from: PortkeyEntries.SECURITY_LOCK_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.GUARDIAN_APPROVAL_ENTRY, () =>
    ReduxProvider(GuardianApproval as React.ComponentType<any>, {
      routerParams: {
        from: PortkeyEntries.GUARDIAN_APPROVAL_ENTRY,
      },
    }),
  );

  // config stage
  entryConfig.set(PortkeyEntries.CHECK_PIN, () =>
    ReduxProvider(CheckPin as React.ComponentType<any>, {
      statusbarColor: 'white',
      routerParams: {
        from: PortkeyEntries.CHECK_PIN,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.SET_PIN, () =>
    ReduxProvider(SetPin as React.ComponentType<any>, {
      statusbarColor: 'white',
      routerParams: {
        from: PortkeyEntries.SET_PIN,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.CONFIRM_PIN, () =>
    ReduxProvider(ConfirmPin as React.ComponentType<any>, {
      statusbarColor: 'white',
      routerParams: {
        from: PortkeyEntries.CONFIRM_PIN,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.SET_BIO, () =>
    ReduxProvider(SetBiometrics as React.ComponentType<any>, {
      statusbarColor: 'white',
      routerParams: {
        from: PortkeyEntries.SET_BIO,
      },
    }),
  );

  // scan QR code
  entryConfig.set(PortkeyEntries.SCAN_QR_CODE, () =>
    ReduxProvider(QrScanner as React.ComponentType<any>, {
      routerParams: {
        from: PortkeyEntries.SCAN_QR_CODE,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.QR_CODE_RESULT, () =>
    ReduxProvider(QrCodeResult as React.ComponentType<any>, {
      routerParams: {
        from: PortkeyEntries.QR_CODE_RESULT,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.SCAN_LOG_IN, () =>
    ReduxProvider(ScanLogin as React.ComponentType<any>, {
      routerParams: {
        from: PortkeyEntries.SCAN_LOG_IN,
      },
    }),
  );

  // guardian manage
  entryConfig.set(PortkeyEntries.GUARDIAN_HOME_ENTRY, () =>
    ReduxProvider(GuardianHome as React.ComponentType<any>, {
      routerParams: { from: PortkeyEntries.GUARDIAN_HOME_ENTRY },
    }),
  );
  entryConfig.set(PortkeyEntries.GUARDIAN_DETAIL_ENTRY, () =>
    ReduxProvider(GuardianDetail as React.ComponentType<any>, {
      routerParams: { from: PortkeyEntries.GUARDIAN_DETAIL_ENTRY },
    }),
  );
  entryConfig.set(PortkeyEntries.ADD_GUARDIAN_ENTRY, () =>
    ReduxProvider(AddGuardian as React.ComponentType<any>, {
      routerParams: { from: PortkeyEntries.ADD_GUARDIAN_ENTRY },
    }),
  );

  // webview
  entryConfig.set(PortkeyEntries.VIEW_ON_WEBVIEW, () =>
    ReduxProvider(ViewOnWebView as React.ComponentType<any>, {
      routerParams: { from: PortkeyEntries.VIEW_ON_WEBVIEW },
    }),
  );
  // account setting
  entryConfig.set(PortkeyEntries.ACCOUNT_SETTING_ENTRY, () =>
    ReduxProvider(AccountSettings, {
      routerParams: {
        from: PortkeyEntries.ACCOUNT_SETTING_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.BIOMETRIC_SWITCH_ENTRY, () =>
    ReduxProvider(Biometric, {
      routerParams: {
        from: PortkeyEntries.BIOMETRIC_SWITCH_ENTRY,
      },
    }),
  );
  // assets module
  entryConfig.set(PortkeyEntries.ASSETS_HOME_ENTRY, () =>
    ReduxProvider(DashBoard, {
      statusBarStyle: 'dark-content',
      routerParams: {
        from: PortkeyEntries.ASSETS_HOME_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.RECEIVE_TOKEN_ENTRY, () =>
    ReduxProvider(Receive, {
      routerParams: {
        from: PortkeyEntries.RECEIVE_TOKEN_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.ACTIVITY_LIST_ENTRY, () =>
    ReduxProvider(ActivityListPage, {
      routerParams: {
        from: PortkeyEntries.ACTIVITY_LIST_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.ACTIVITY_DETAIL_ENTRY, () =>
    ReduxProvider(ActivityDetail, {
      routerParams: {
        from: PortkeyEntries.ACTIVITY_DETAIL_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.TOKEN_MANAGE_LIST_ENTRY, () =>
    ReduxProvider(ManageTokenList, {
      routerParams: {
        from: PortkeyEntries.TOKEN_MANAGE_LIST_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.TOKEN_MANAGE_ADD_ENTRY, () =>
    ReduxProvider(CustomToken, {
      routerParams: {
        from: PortkeyEntries.TOKEN_MANAGE_ADD_ENTRY,
      },
    }),
  );
  // send service
  entryConfig.set(PortkeyEntries.SEND_TOKEN_HOME_ENTRY, () =>
    ReduxProvider(SendHome, {
      routerParams: {
        from: PortkeyEntries.SEND_TOKEN_HOME_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.SEND_TOKEN_CONFIRM_ENTRY, () =>
    ReduxProvider(SendPreview, {
      routerParams: {
        from: PortkeyEntries.SEND_TOKEN_CONFIRM_ENTRY,
      },
    }),
  );
  // payment security module
  entryConfig.set(PortkeyEntries.PAYMENT_SECURITY_HOME_ENTRY, () =>
    ReduxProvider(PaymentSecurityList, {
      routerParams: {
        from: PortkeyEntries.PAYMENT_SECURITY_HOME_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.PAYMENT_SECURITY_DETAIL_ENTRY, () =>
    ReduxProvider(PaymentSecurityDetail, {
      routerParams: {
        from: PortkeyEntries.PAYMENT_SECURITY_DETAIL_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.PAYMENT_SECURITY_EDIT_ENTRY, () =>
    ReduxProvider(PaymentSecurityEdit, {
      routerParams: {
        from: PortkeyEntries.PAYMENT_SECURITY_EDIT_ENTRY,
      },
    }),
  );

  entryConfig.set(PortkeyEntries.TOKEN_DETAIL_ENTRY, () =>
    ReduxProvider(TokenDetail, {
      routerParams: {
        from: PortkeyEntries.TOKEN_DETAIL_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.NFT_DETAIL_ENTRY, () =>
    ReduxProvider(NFTDetail, {
      routerParams: {
        from: PortkeyEntries.NFT_DETAIL_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.CONTACT_ACTIVITY_ENTRY, () =>
    ReduxProvider(ContactActivity, {
      routerParams: {
        from: PortkeyEntries.CONTACT_ACTIVITY_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.RAMP_HOME_ENTRY, () =>
    ReduxProvider(RampHome, {
      routerParams: {
        from: PortkeyEntries.RAMP_HOME_ENTRY,
      },
    }),
  );
  entryConfig.set(PortkeyEntries.RAMP_PREVIEW_ENTRY, () =>
    ReduxProvider(RampPreview, {
      routerParams: {
        from: PortkeyEntries.RAMP_PREVIEW_ENTRY,
      },
    }),
  );
  for (const [key, value] of entryConfig) {
    AppRegistry.registerComponent(wrapEntry(key), value);
  }
  registerLaunchMode();
};
export { initEntries };
