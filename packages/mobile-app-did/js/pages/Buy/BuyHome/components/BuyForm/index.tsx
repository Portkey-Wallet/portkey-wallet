import React from 'react';
import BuyMainForm from './main';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

export default function BuyForm() {
  const isMainNetwork = useIsMainnet();
  return isMainNetwork ? <BuyMainForm /> : null;
}
