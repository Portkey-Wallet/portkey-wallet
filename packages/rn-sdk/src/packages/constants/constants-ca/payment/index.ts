import { CountryItem } from 'packages/types/types-ca/payment';
import countryCodeMapJson from './countryCodeList.json';
import { ChainId } from 'packages/types';

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

export const FAUCET_URL = 'https://testnet-faucet.aelf.io/';

export const SELL_SOCKET_TIMEOUT = 15 * 1000;

export const BUY_SOON_TEXT = 'On-ramp is currently not supported. It will be launched in the coming weeks.';

export const SELL_SOON_TEXT = 'Off-ramp is currently not supported. It will be launched in the coming weeks.';

export const SERVICE_UNAVAILABLE_TEXT = 'Sorry, the service you are using is temporarily unavailable.';

export const DISCLAIMER_TEXT =
  'AlchemyPay is a fiat-to-crypto platform independently operated by a third-party entity. Portkey shall not be held liable for any losses or damages suffered as a result of using AlchemyPay services.';

export const INSUFFICIENT_FUNDS_TEXT = 'Insufficient funds';

export const SYNCHRONIZING_CHAIN_TEXT = 'Synchronizing on-chain account information...';
