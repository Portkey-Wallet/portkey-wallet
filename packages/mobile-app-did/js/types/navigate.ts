import { IToSendPreviewParamsType } from '@portkey-wallet/types/types-ca/routeParams';
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
};
