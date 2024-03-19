import { RampType } from '@portkey-wallet/ramp';
import { useMemo } from 'react';
import { IconName } from 'components/Svg';
import { useSDKRampEntryShow } from 'pages/Ramp/RampPreview/hook';
import { simple_navigateTo_func } from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
const navigateTo = simple_navigateTo_func();
export type DepositItem = {
  title: string;
  icon: IconName;
  description: string;
  onPress: () => void;
};
const DepositMap = {
  buy: {
    title: 'Buy Crypto',
    icon: 'buy2',
    description: 'Buy crypto using fiat currency',
    // onPress: () => navigationService.navigate('RampHome', { toTab: RampType.BUY }),
    onPress: () => navigateTo(PortkeyEntries.RAMP_HOME_ENTRY, { params: { toTab: RampType.BUY } }),
  },
  sell: {
    title: 'Sell Crypto',
    icon: 'sell',
    description: 'Sell crypto for fiat currency',
    // onPress: () => navigationService.navigate('RampHome', { toTab: RampType.SELL }),
    onPress: () => navigateTo(PortkeyEntries.RAMP_HOME_ENTRY, { params: { toTab: RampType.SELL } }),
  },
};

export type ModalDescribe = {
  title: string;
  description: string;
  icon?: IconName;
};

export function useDepositList() {
  const { isBuySectionShow, isSellSectionShow } = useSDKRampEntryShow();

  return useMemo(() => {
    const list = [];
    if (isBuySectionShow) list.push(DepositMap.buy);
    if (isSellSectionShow) list.push(DepositMap.sell);
    return list;
  }, [isBuySectionShow, isSellSectionShow]);
}
