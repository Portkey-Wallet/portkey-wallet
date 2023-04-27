import { PaymentStateType } from '@portkey-wallet/store/store-ca/payment/type';

export const PaymentState: { payment: PaymentStateType } = {
  payment: {
    achTokenInfo: {
      expires: 1682146455494,
      token: 'ACH...gA==',
    },
    buyFiatList: [
      {
        country: 'AD',
        countryName: 'Andorra',
        currency: 'EUR',
        fixedFee: '0.410000',
        icon: 'https://localhost/alchemypay/flag/AD.png',
        payMax: '5153.000000',
        payMin: '15.000000',
        payWayCode: '10001',
        payWayName: 'Credit Card',
        rateFee: undefined,
      },
      {
        country: 'AD',
        countryName: 'Andorra',
        currency: 'USD',
        fixedFee: '0.400000',
        icon: 'https://localhost/alchemypay/flag/AD.png',
        payMax: '5000.000000',
        payMin: '15.000000',
        payWayCode: '701',
        payWayName: 'Google Pay',
        rateFee: undefined,
      },
      {
        country: 'AE',
        countryName: 'United Arab Emirates',
        currency: 'USD',
        fixedFee: '0.400000',
        icon: 'https://localhost/alchemypay/flag/AE.png',
        payMax: '5000.000000',
        payMin: '15.000000',
        payWayCode: '10001',
        payWayName: 'Credit Card',
        rateFee: undefined,
      },
    ],
    sellFiatList: [],
  },
};
