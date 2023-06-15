import { RootCommonState } from '../store';
import { tokenBalanceSlice } from '@portkey-wallet/store/tokenBalance/slice';
import { tokenManagementSlice } from '@portkey-wallet/store/store-ca/tokenManagement/slice';
import { recentSlice, RecentStateType } from '@portkey-wallet/store/store-ca/recent/slice';

import { TokenState } from './token';
import { TokenBalanceState } from './tokenBalance';
import { assetsSlice, AssetsStateType } from '@portkey-wallet/store/store-ca/assets/slice';
import { activitySlice } from '@portkey-wallet/store/store-ca/activity/slice';
import { walletSlice } from '@portkey-wallet/store/store-ca/wallet/slice';
import { WalletState } from '@portkey-wallet/store/store-ca/wallet/type';
import { GuardiansState } from '@portkey-wallet/store/store-ca/guardians/type';
import { guardiansSlice } from '@portkey-wallet/store/store-ca/guardians/slice';
import { contactSlice, ContactState } from '@portkey-wallet/store/store-ca/contact/slice';
import { ActivityStateType } from '@portkey-wallet/store/store-ca/activity/type';
import { discoverSlice } from '@portkey-wallet/store/store-ca/discover/slice';
import { IDiscoverStateType } from '@portkey-wallet/store/store-ca/discover/type';

import { paymentSlice } from '@portkey-wallet/store/store-ca/payment/slice';
import { PaymentStateType } from '@portkey-wallet/store/store-ca/payment/type';
import { switchSlice, SwitchStateTypes } from '@portkey-wallet/store/store-ca/switch/slice';
import { miscSlice } from '@portkey-wallet/store/store-ca/misc/slice';
import { MiscState } from '@portkey-wallet/store/store-ca/misc/types';
import { dappSlice } from '@portkey-wallet/store/store-ca/dapp/slice';
import { IDappStoreState } from '@portkey-wallet/store/store-ca/dapp/type';
import { cmsSlice } from '@portkey-wallet/store/store-ca/cms/slice';
import { CMSState } from '@portkey-wallet/store/store-ca/cms/types';

export type CACommonState = RootCommonState & {
  [tokenManagementSlice.name]: TokenState;
  [tokenBalanceSlice.name]: TokenBalanceState;
  [recentSlice.name]: RecentStateType;
  [assetsSlice.name]: AssetsStateType;
  [activitySlice.name]: ActivityStateType;
  [walletSlice.name]: WalletState;
  [contactSlice.name]: ContactState;
  [guardiansSlice.name]: GuardiansState;
  [discoverSlice.name]: IDiscoverStateType;
  [paymentSlice.name]: PaymentStateType;
  [switchSlice.name]: SwitchStateTypes;
  [miscSlice.name]: MiscState;
  [dappSlice.name]: IDappStoreState;
  [cmsSlice.name]: CMSState;
};
