import React from 'react';
import { TNetworkItem, TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import OverlayModal from 'components/OverlayModal';
import { Keyboard } from 'react-native';
import { SelectNetworkModal } from '../SelectToken';

export type IPaySelectTokenProps = {
  networkList: TNetworkItem[];
} & ISelectBaseProps;

export type IReceiveSelectTokenProps = {
  networkDataList: { network: TNetworkItem; tokenList: TTokenItem[] }[];
} & ISelectBaseProps;

export interface ISelectBaseProps {
  currentToken: TTokenItem;
  currentNetwork: TNetworkItem;
  onResolve: OnSelectFinishCallback;
  onReject: (reason?: any) => void;
}

export type ISelectTokenResult = {
  network: TNetworkItem;
  token: TTokenItem;
};

export const selectPayToken = (props: IPaySelectTokenProps): Promise<ISelectTokenResult> => {
  return new Promise((resolve, reject) => {
    Keyboard.dismiss();
    OverlayModal.show(
      <SelectNetworkModal
        {...props}
        onResolve={data => {
          resolve(data);
          OverlayModal.hide();
        }}
        onReject={reject}
      />,
      {
        position: 'bottom',
      },
    );
  });
};

export const selectReceiveToken = (props: IReceiveSelectTokenProps): Promise<ISelectTokenResult> => {
  return new Promise((resolve, reject) => {
    Keyboard.dismiss();
    OverlayModal.show(
      <SelectNetworkModal
        {...props}
        onResolve={data => {
          resolve(data);
          OverlayModal.hide();
        }}
        onReject={reject}
      />,
      {
        position: 'bottom',
      },
    );
  });
};

export type OnSelectFinishCallback = (data: ISelectTokenResult) => void;
