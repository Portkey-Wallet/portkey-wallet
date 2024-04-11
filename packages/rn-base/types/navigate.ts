import { IToSendPreviewParamsType, ImTransferInfoType } from '@portkey-wallet/types/types-ca/routeParams';
// import { NavigateName } from '@portkey-wallet/rn-inject';

export type NavigateName = string; // todo_wade

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
