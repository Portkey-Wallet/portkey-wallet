import { SvgType } from 'components/CustomSvg';

export enum DepositType {
  buy,
  sell,
  'deposit-usdt',
  'withdraw-usdt',
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
    title: 'Deposit USDT',
    type: DepositType['deposit-usdt'],
    icon: 'Deposit',
    desc: 'Receive USDT from other chains',
  },
  {
    title: 'Withdraw USDT',
    type: DepositType['withdraw-usdt'],
    icon: 'Withdraw',
    desc: 'Send USDT to other chains',
  },
  {
    title: 'Cross-Chain Bridge',
    type: DepositType.bridge,
    icon: 'Bridge',
    desc: 'Make cross-chain transfers',
  },
];
