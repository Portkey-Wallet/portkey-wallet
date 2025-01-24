import { NetworkType } from '@portkey-wallet/types';
import { IChainItemType } from '@portkey-wallet/types/types-eoa/chain';
import { TAccountInfo, TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';

export type TWalletState = {
  walletList: TWalletInfo[];
  privateKeyAccountList: TAccountInfo[];
  currentAccountAddress?: TAccountInfo['address'];
  networkType: NetworkType;
  hideAssets: boolean;
  chainInfo?: { [key in NetworkType]?: IChainItemType[] };
};

// export interface WalletState {
//   walletAvatar: string; // to be scrapped, please use userInfo.avatar
//   walletType: WalletType;
//   currentNetwork: NetworkType;
//   walletInfo?: CAWalletInfoType;
//   chainList: IChainItemType[];
//   chainInfo?: { [key in NetworkType]?: IChainItemType[] };
//   originChainId?: ChainId;
//   userInfo?: { [key in NetworkType]?: UserInfoType };
//   tmpWalletInfo?: TWalletInfo;
//   checkManagerExceedMap?: { [key in NetworkType]?: boolean };
// }
