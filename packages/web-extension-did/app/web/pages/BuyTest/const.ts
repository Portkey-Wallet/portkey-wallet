export enum PageType {
  buy,
  sell,
}

export const rate = 0.3077;
export const receive = 100;
export const payment = 30.77;
export const MAX_UPDATE_TIME = 15;
export const curToken = {
  symbol: 'ELF',
  chainId: 'AELF',
};
export const curFiat = {
  currency: 'USD',
  country: 'US',
};
export const testnetTip =
  "This is a simulated on-ramp purchase on aelf's Testnet with virtual payment method. The tokens you will receive are Testnet tokens.";
export const sellSoonText =
  'Off-ramp is currently not supported. It will be enabled once Portkey launches on aelf Mainnet.';
export const receiveText = 'I will receive ≈ 100 ELF';
export const showRateText = `1 ELF ≈ ${rate} USD`;
export const confirmReceiveText = `100 ELF for ${payment} USD`;
export const visaCardType = 'Visa Card';
export const visaCardNum = '(****7760)';
export const overTimeText = "Today's limit has been reached.";
