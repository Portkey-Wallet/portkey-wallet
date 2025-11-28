import React from 'react';
import { TNetworkItem, TTokenItem } from '@portkey-wallet/types/types-ca/deposit';
import OverlayModal from 'components/OverlayModal';
import { Keyboard } from 'react-native';
import { SelectNetworkModal } from '../SelectToken';

export interface ISelectBaseProps {
  networkList: TNetworkItem[];
  currentToken: TTokenItem;
  currentNetwork: TNetworkItem;
}

export type ISelectTokenResult = {
  network: TNetworkItem;
  token: TTokenItem;
};

export const selectPayToken = (props: ISelectBaseProps): Promise<ISelectTokenResult> => {
  return selectToken(props, true);
};

export const selectReceiveToken = (props: ISelectBaseProps): Promise<ISelectTokenResult> => {
  return selectToken(props, false);
};

const selectToken = (props: ISelectBaseProps, isPay: boolean): Promise<ISelectTokenResult> => {
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
        isPay={isPay}
      />,
      {
        position: 'bottom',
        enabledNestScrollView: true,
      },
    );
  });
};

export type OnSelectFinishCallback = (data: ISelectTokenResult) => void;
