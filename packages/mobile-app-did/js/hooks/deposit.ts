import { RampType } from '@portkey-wallet/ramp';
import { useCallback, useMemo } from 'react';
import navigationService from 'utils/navigationService';
import { useAppBridgeButtonShow, useAppETransShow } from './cms';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import DisclaimerModal from 'components/DisclaimerModal';
import { getUrlObj } from '@portkey-wallet/utils/dapp/browser';
import { IconName } from 'components/Svg';
import { stringifyETrans } from '@portkey-wallet/utils/dapp/url';
import { useAppRampEntryShow } from './ramp';

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
    onPress: () => navigationService.navigate('RampHome', { toTab: RampType.BUY }),
  },
  sell: {
    title: 'Sell Crypto',
    icon: 'sell',
    description: 'Sell crypto for fiat currency',
    onPress: () => navigationService.navigate('RampHome', { toTab: RampType.SELL }),
  },
  depositUSDT: {
    title: 'Deposit Crypto',
    icon: 'deposit',
    description: 'Receive USDT & SGR from other chains',
    onPress: () => {
      // rewrite onPress
    },
  },
  withdrawUSDT: {
    title: 'Withdraw Crypto',
    icon: 'withdraw',
    description: 'Send USDT & SGR to other chains',
    onPress: () => {
      // rewrite onPress
    },
  },
  bridge: {
    title: 'Cross-Chain Bridge',
    icon: 'bridge',
    description: 'Make cross-chain transfers',
    onPress: () => {
      // rewrite onPress
    },
  },
};

export type ModalDescribe = {
  title: string;
  description: string;
  icon?: IconName;
};

const DepositModalMapRaw = {
  bridge: {
    title: 'eBridge',
    description: 'You will be directed to a third-party DApp: eBridge',
  },
  depositUSDT: {
    title: 'ETransfer',
    description: 'You will be directed to a third-party DApp: ETransfer',
    icon: 'ETransfer',
  },
  withdrawUSDT: {
    title: 'ETransfer',
    description: 'You will be directed to a third-party DApp: ETransfer',
    icon: 'ETransfer',
  },
  eTransfer: {
    title: 'ETransfer',
    description: 'You will be directed to a third-party DApp: ETransfer',
    icon: 'ETransfer',
  },
  AwakenSwap: {
    title: 'AwakenSwap',
    description: 'You will be directed to a third-party DApp: AwakenSwap',
    icon: 'awaken-swap-round',
  },
};

export type DepositModalMapType = { [key in keyof typeof DepositModalMapRaw]: ModalDescribe };

export const DepositModalMap: DepositModalMapType = DepositModalMapRaw as any;

export function useOnDisclaimerModalPress() {
  const { checkDappIsConfirmed } = useDisclaimer();

  return useCallback(
    async (modalDescribe: ModalDescribe, url: string) => {
      try {
        const { origin } = getUrlObj(url);

        if (!checkDappIsConfirmed(origin))
          return DisclaimerModal.showDisclaimerModal({
            ...modalDescribe,
            url,
          });
        navigationService.navigate('ProviderWebPage', {
          title: modalDescribe.title,
          url,
          icon: modalDescribe.icon,
        });
      } catch (error) {
        console.log(error);
      }
    },
    [checkDappIsConfirmed],
  );
}

export function useDepositList() {
  const { isBuySectionShow, isSellSectionShow } = useAppRampEntryShow();
  const { isBridgeShow } = useAppBridgeButtonShow();
  const { isETransDepositShow, isETransWithdrawShow } = useAppETransShow();

  const { eBridgeUrl, eTransferUrl } = useCurrentNetworkInfo();

  const onDisclaimerModalPress = useOnDisclaimerModalPress();
  return useMemo(() => {
    const list = [];
    if (isBuySectionShow) list.push(DepositMap.buy);
    if (isSellSectionShow) list.push(DepositMap.sell);
    if (isETransDepositShow)
      list.push({
        ...DepositMap.depositUSDT,
        onPress: () =>
          onDisclaimerModalPress(
            DepositModalMap.depositUSDT,
            stringifyETrans({
              url: eTransferUrl || '',
              query: {
                type: 'Deposit',
              },
            }),
          ),
      });
    if (isETransWithdrawShow) {
      list.push({
        ...DepositMap.withdrawUSDT,
        onPress: () =>
          onDisclaimerModalPress(
            DepositModalMap.withdrawUSDT,
            stringifyETrans({
              url: eTransferUrl || '',
              query: {
                type: 'Withdraw',
              },
            }),
          ),
      });
    }
    if (isBridgeShow)
      list.push({
        ...DepositMap.bridge,
        onPress: () => onDisclaimerModalPress(DepositModalMap.bridge, eBridgeUrl || ''),
      });

    return list;
  }, [
    isBuySectionShow,
    isSellSectionShow,
    isETransDepositShow,
    isETransWithdrawShow,
    isBridgeShow,
    onDisclaimerModalPress,
    eTransferUrl,
    eBridgeUrl,
  ]);
}
