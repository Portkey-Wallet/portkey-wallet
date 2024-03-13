import { IToSendHomeParamsType } from '.';
export interface IAssetsService {
  openAssetsDashboard(): Promise<void>;
  openSendToken(props: IToSendHomeParamsType): Promise<void>;
}
