import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BackEndNetWorkMap } from './backend-network';
import { LINK_PATH_ENUM } from './link';

export const NetworkList: NetworkItem[] = [
  BackEndNetWorkMap['back-end-mainnet-v2'],
  BackEndNetWorkMap['back-end-testnet-v2'],
];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';

export const ThirdParty = `https://thirdparty.portkey.finance`;

export const OpenLogin = `https://openlogin.portkey.finance`;

const EBridgeList = NetworkList.map(i => i.eBridgeUrl).filter(i => !!i) as string[];
const ETransferList = NetworkList.map(i => i.eTransferUrl).filter(i => !!i) as string[];
export const DAPP_WHITELIST: string[] = [...EBridgeList, ...ETransferList];

export const LinkPortkeyWebsite = OfficialWebsite;

export const LinkPortkeyPath = {
  addContact: LinkPortkeyWebsite + LINK_PATH_ENUM.addContact,
  addGroup: LinkPortkeyWebsite + LINK_PATH_ENUM.addGroup,
};
