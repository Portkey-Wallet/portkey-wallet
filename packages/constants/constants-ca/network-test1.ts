import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BackEndNetWorkMap } from './backend-network';

export const NetworkList: NetworkItem[] = [BackEndNetWorkMap['back-end-test2'], BackEndNetWorkMap['back-end-test1']];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';
export const OfficialWebsitePortkeyIdPath = 'https://portkey.finance/sc/ac';

export const BingoGame = 'http://192.168.66.240:3000';

export const ThirdParty = `https://openlogin-test.portkey.finance`;

export const LinkWebsite = 'https://portkey-website-dev.vercel.app';

export const AddContactLinkPath = LinkWebsite + '/sc/ac/';
