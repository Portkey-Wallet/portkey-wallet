import React, { useMemo } from 'react';
import OverlayModal from '../OverlayModal';
import { Keyboard } from 'react-native';
import { CommonButtonProps } from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-eoa/discover/slice';
import { useAppDispatch } from 'store/hooks';
import { sleep } from '@portkey-wallet/utils';
import { useAppCASelector } from '@portkey-wallet/hooks';
import { ChainId } from '@portkey/provider-types';
import { AlertBody } from 'components/ActionSheet';

function WalletSecurityOverlayAlertBody({ accelerateChainId }: { accelerateChainId: ChainId }) {
  const dispatch = useAppDispatch();
  const isDrawerOpen = useAppCASelector(state => state.discover.isDrawerOpen);

  const buttons = useMemo((): {
    title: string;
    type: CommonButtonProps['type'];
    onPress?: () => void;
  }[] => {
    return [
      {
        title: 'Not now',
        type: 'outline',
      },
      {
        title: 'Add Guardians',
        type: 'primary',
        onPress: async () => {
          navigationService.navigateByMultiLevelParams('GuardianEdit', {
            params: {
              accelerateChainId,
            },
            multiLevelParams: {
              approveParams: {
                isDiscover: isDrawerOpen,
              },
            },
          });
          if (isDrawerOpen) {
            await sleep(250);
            dispatch(changeDrawerOpenStatus(false));
          }
        },
      },
    ];
  }, [accelerateChainId, dispatch, isDrawerOpen]);

  return (
    <AlertBody
      showInfoIcon
      title="Upgrade wallet security level"
      message="You have too few guardians to protect your wallet. Please add at least one more guardian before proceeding."
      buttons={buttons}
    />
  );
}

const alert = async (accelerateChainId: ChainId) => {
  Keyboard.dismiss();
  OverlayModal.show(<WalletSecurityOverlayAlertBody accelerateChainId={accelerateChainId} />, {
    modal: true,
    type: 'zoomOut',
    position: 'bottom',
  });
  await sleep(300);
};
export default {
  alert,
};
