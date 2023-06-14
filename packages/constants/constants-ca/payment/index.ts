import { CountryItem } from '@portkey-wallet/types/types-ca/payment';
import countryCodeMapJson from './countryCodeList.json';
import { ChainId } from '@portkey-wallet/types';

const getCountryCodeMap = (list: CountryItem[]) => {
  const country: { [key: string]: CountryItem } = {};
  list.forEach(item => {
    country[item.iso] = item;
  });
  return country;
};

export const countryCodeList = countryCodeMapJson.countryCode;

export const countryCodeMap = getCountryCodeMap(countryCodeList);

export const DefaultCountry: CountryItem = {
  country: 'United States',
  iso: 'US',
  icon: 'https://static.alchemypay.org/alchemypay/flag/US.png',
};

export const TOKEN_CLAIM_CONTRACT_CHAIN_ID = 'AELF' as ChainId;

export enum TransDirectEnum {
  TOKEN_BUY = 'TokenBuy',
  TOKEN_SELL = 'TokenSell',
}

export const ACH_MERCHANT_NAME = 'Alchemy';

export const FaucetUrl = 'https://testnet-faucet.aelf.io/';

export const SELL_SOCKET_TIMEOUT = 20 * 1000;
