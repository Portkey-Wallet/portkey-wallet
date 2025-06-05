import { useEffectOnce } from '@portkey-wallet/hooks';
import { useState } from 'react';
import { useUserInfo } from 'store/Provider/hooks';
import { getPin } from 'utils/getSeed';

export const usePin = () => {
  const { passwordSeed } = useUserInfo();
  const [pin, setPin] = useState<string>(passwordSeed);

  useEffectOnce(() => {
    getPin().then(setPin);
  });

  return passwordSeed || pin;
};
