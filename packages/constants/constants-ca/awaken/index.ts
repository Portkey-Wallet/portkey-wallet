import { NetworkType } from '@portkey-wallet/types';

export const priceImpactList = [
  { value: '0.005', label: '0.5%' },
  { value: '0.01', label: '1%' },
  { value: '0.03', label: '3%' },
];

export const DEFAULT_SLIPPAGE_TOLERANCE = priceImpactList[0].value;

export const DEFAULT_EXPIRATION = '20';

export const SWAP_HOOK_CONTRACT_ADDRESS_MAP: Record<NetworkType, string> = {
  MAINNET: 'T3mdFC35CQSatUXQ5bQ886pULo2TnzS9rfXxmsoZSGnTq2a2S',
  TESTNET: '2vahJs5WeWVJruzd1DuTAu3TwK8jktpJ2NNeALJJWEbPQCUW4Y',
};

export const LIMIT_CONTRACT_ADDRESS: Record<NetworkType, string> = {
  MAINNET: 'BEakVbMWHXqQAn3oj3nj2dPk8jfFeJeTg9C99rPZiYTBhGB1a',
  TESTNET: '2BC4BosozC1x27izqrSFJ51gYYtyVByjKGZvmitY7EBFDDPYHN',
};

export const AWAKEN_DEFAULT_CID = '123456';
