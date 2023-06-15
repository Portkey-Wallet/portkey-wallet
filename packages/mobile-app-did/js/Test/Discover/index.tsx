import React from 'react';
import { defaultColors } from 'assets/theme';
import CustomHeader from 'components/CustomHeader';
import SafeAreaBox from 'components/SafeAreaBox';
import navigationService from 'utils/navigationService';
import CommonButton from 'components/CommonButton';
import DappEventBus from 'dapp/dappEventBus';
import ProviderWebview from 'components/ProviderWebview';

const safeAreaColorMap = {
  white: defaultColors.bg1,
  blue: defaultColors.bg5,
  gray: defaultColors.bg4,
  transparent: 'transparent',
};

export type SafeAreaColorMapKeyUnit = keyof typeof safeAreaColorMap;

const Discover: React.FC = () => {
  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[{ backgroundColor: safeAreaColorMap.blue }]}>
      <CustomHeader titleDom="Discover" leftCallback={navigationService.goBack} />
      <ProviderWebview source={{ uri: 'http://localhost:3000' }} />
      <CommonButton
        onPress={() => {
          DappEventBus.dispatchEvent({
            eventName: 'accountsChanged',
            data: {
              AELF: ['iC1BZJsrn9jEYJ4ABgDnpqaYYbu7JB3fZuBJS5xAoZJB3yBVU'],
              tDVW: ['2BhwLPoSj2z3GSTrBphmqJJ9yq3hdxtLaDQgyoJnJBHvB9cpw1'],
            },
          });
        }}
        title="accountsChanged"
      />
      <CommonButton
        onPress={() => {
          DappEventBus.dispatchEvent({
            eventName: 'accountsChanged',
            origin: 'http://localhost:3001',
            data: {
              AELF: ['iC1BZJsrn9jEYJ4ABgDnpqaYYbu7JB3fZuBJS5xAoZJB3yBVU'],
              tDVW: ['2BhwLPoSj2z3GSTrBphmqJJ9yq3hdxtLaDQgyoJnJBHvB9cpw1'],
            },
          });
        }}
        title="accountsChanged origin"
      />
      <CommonButton
        onPress={() => {
          DappEventBus.dispatchEvent({
            eventName: 'chainChanged',
            data: ['AELF', 'tDVV'],
          });
        }}
        title="chainChanged"
      />
    </SafeAreaBox>
  );
};

export default Discover;
