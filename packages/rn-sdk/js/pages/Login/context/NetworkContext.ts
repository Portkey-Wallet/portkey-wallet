import { createContext } from 'react';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';

export interface NetworkContextState {
  currentNetwork: NetworkItem | undefined;
  changeCurrentNetwork: (network: NetworkItem) => void;
}

const NetworkContext = createContext<NetworkContextState>({
  currentNetwork: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeCurrentNetwork: () => {},
});

export default NetworkContext;
