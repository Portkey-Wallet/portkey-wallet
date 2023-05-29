import { CACommonState } from './store';

export interface IDappManager {
  checkOriginIsAuthorized(origin: string): boolean;
}

export type IDappManagerStore = {
  getState: () => CACommonState;
  dispatch: any;
};

export type DappManagerOptions = {
  store: IDappManagerStore;
};
