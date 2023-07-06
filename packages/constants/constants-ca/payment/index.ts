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

export const buySoonText = 'On-ramp is currently not supported. It will be launched in the coming weeks.';

export const sellSoonText = 'Off-ramp is currently not supported. It will be launched in the coming weeks.';

export const serviceUnavailableText = 'Sorry, the service you are using is temporarily unavailable.';

export const soonText = 'On-ramp is not supported on the Testnet. The on-ramp service on Mainnet is coming soon.';

export const disclaimer =
  'AlchemyPay is a fiat-to-crypto platform independently operated by a third-party entity. Portkey shall not be held liable for any losses or damages suffered as a result of using AlchemyPay services.';

export const InsufficientFundsText = 'Insufficient funds';

export const SynchronizingChainText = 'Synchronizing on-chain account information...';
