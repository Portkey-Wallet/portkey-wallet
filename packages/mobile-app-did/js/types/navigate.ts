import { ChatTabName } from '@portkey-wallet/constants/constants-ca/chat';
import { IToSendPreviewParamsType, ImTransferInfoType } from '@portkey-wallet/types/types-ca/routeParams';
import { NavigateName } from 'utils/navigationService';

export type NavigateMultiLevelOptions = {
  params?: any;
  multiLevelParams: NavigateMultiLevelParams;
};

export type NavigateMultiLevelParams = {
  successNavigateName?: NavigateName;
  successNavigate?: {
    name: NavigateName;
    params?: any;
  };
  sendTransferPreviewApprove?: {
    successNavigateName: NavigateName;
    params: IToSendPreviewParamsType;
  };
  setLoginAccountNavigate?: {
    from: NavigateName;
    successParams?: any;
    backParams?: any;
  };
  imTransferInfo?: ImTransferInfoType;
  approveParams?: {
    isDiscover?: boolean;
    eventName?: string;
  };
};

export enum TabRouteNameEnum {
  WALLET = 'Wallet',
  DISCOVER = 'Discover',
  ACTIVITY = 'Activity',
  // TRADE = 'Trade',
  CHAT = 'Chat',
  SETTINGS = 'Settings',
}
