import { useReturnLastCallback } from '@portkey-wallet/hooks';
import { useGetAwakenGasFee, useGetSwapRoutes } from '@portkey-wallet/hooks/hooks-ca/awaken/request';
import { useAwakenGasFee, useAwakenTokenList } from '@portkey-wallet/hooks/hooks-ca/awaken/state';
import CurrencyInput from '../CurrencyInput';

const SwapEnter = () => {
  const getSwapRoutesInstant = useGetSwapRoutes();
  // const getSwapRoutes = useReturnLastCallback(getSwapRoutesInstant, [getSwapRoutesInstant]);
  const gasFee = useAwakenGasFee();
  const { list } = useAwakenTokenList();
  console.log(list, gasFee, '====list');

  return <div>SWAP</div>;
};

export default SwapEnter;
