import React from 'react';
import Card from './Card';
import { useAppCommonDispatch } from '@portkey-wallet/hooks/index';
import DashBoardTab from './DashBoardTab';
import useEffectOnce from 'hooks/useEffectOnce';
import { useGetCurrentCAViewContract } from 'hooks/contract';
import { getWalletNameAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { getSymbolImagesAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { useGetGuardiansInfoWriteStore } from 'hooks/guardian';
import { fetchBuyFiatListAsync } from '@portkey-wallet/store/store-ca/payment/actions';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';

const DashBoard: React.FC = () => {
  useGetCurrentAccountTokenPrice();

  const dispatch = useAppCommonDispatch();
  const getCurrentCAViewContract = useGetCurrentCAViewContract();
  const { caHash } = useCurrentWalletInfo();
  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  const isMainNetwork = useIsMainnet();

  useEffectOnce(() => {
    getCurrentCAViewContract();
  });

  useEffectOnce(() => {
    if (isMainNetwork) {
      dispatch(fetchBuyFiatListAsync());
    }
    dispatch(getWalletNameAsync());
    dispatch(getSymbolImagesAsync());
    getGuardiansInfoWriteStore({
      caHash,
    });
  });

  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <Card />
      <DashBoardTab />
    </SafeAreaBox>
  );
};

export default DashBoard;
