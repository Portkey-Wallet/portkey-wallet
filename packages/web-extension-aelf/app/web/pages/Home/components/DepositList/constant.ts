import { SvgType } from 'components/CustomSvg';

export enum DepositType {
  buy,
  sell,
  'deposit-crypto',
  'withdraw-crypto',
  bridge,
}

export interface IDepositItem {
  title: string;
  type: DepositType;
  icon: SvgType;
  desc: string;
}

export const depositList: IDepositItem[] = [
  {
    title: 'Buy Crypto',
    type: DepositType.buy,
    icon: 'Buy',
    desc: 'Buy crypto using fiat currency',
  },
  {
    title: 'Sell Crypto',
    type: DepositType.sell,
    icon: 'Sell',
    desc: 'Sell crypto for fiat currency',
  },
  {
    title: 'Deposit Crypto',
    type: DepositType['deposit-crypto'],
    icon: 'Deposit',
    desc: 'Receive USDT & SGR from other chains',
  },
  {
    title: 'Withdraw Crypto',
    type: DepositType['withdraw-crypto'],
    icon: 'Withdraw',
    desc: 'Send USDT & SGR to other chains',
  },
  {
    title: 'Cross-Chain Bridge',
    type: DepositType.bridge,
    icon: 'Bridge',
    desc: 'Make cross-chain transfers',
  },
];
