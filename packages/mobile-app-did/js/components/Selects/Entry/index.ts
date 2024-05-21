import { TNetworkItem, TTokenItem } from '@portkey-wallet/types/types-ca/deposit';

export type IPaySelectTokenProps = {
  networkList: TNetworkItem[];
} & ISelectBaseProps;

export type IReceiveSelectTokenProps = {
  networkDataList: { network: TNetworkItem; tokenList: TTokenItem[] }[];
} & ISelectBaseProps;

export interface ISelectBaseProps {
  currentToken: TTokenItem;
  currentNetwork: TNetworkItem;
}

export type ISelectTokenResult = {
  network: TNetworkItem;
  token: TTokenItem;
};

export const selectPayToken = (props: IPaySelectTokenProps): Promise<ISelectTokenResult> => {
  return new Promise(resolve => {
    resolve({ network: props.networkList[0], token: props.currentToken });
  });
};

export const selectReceiveToken = (props: IReceiveSelectTokenProps): Promise<ISelectTokenResult> => {
  return new Promise(resolve => {
    resolve({ network: props.networkDataList[0].network, token: props.currentToken });
  });
};
