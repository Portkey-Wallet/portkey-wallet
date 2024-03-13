import React, { useMemo } from 'react';
import OverlayModal from '../OverlayModal';
import { View, Keyboard, StyleSheet, Image } from 'react-native';
import ButtonRow from 'components/ButtonRow';
import { CommonButtonProps } from 'components/CommonButton';
import securityWarning from 'assets/image/pngs/securityWarning.png';
import navigationService from 'utils/navigationService';
import { defaultColors } from 'assets/theme';
import { TextM, TextXL } from 'components/CommonText';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import { useAppDispatch } from 'store/hooks';
import { sleep } from '@portkey-wallet/utils';
import { useAppCASelector } from '@portkey-wallet/hooks';
import { ChainId } from '@portkey/provider-types';

function AlertBody({ accelerateChainId }: { accelerateChainId: ChainId }) {
  const dispatch = useAppDispatch();
  const isDrawerOpen = useAppCASelector(state => state.discover.isDrawerOpen);

  const buttons = useMemo((): {
    title: string;
    type: CommonButtonProps['type'];
    onPress: () => void;
  }[] => {
    return [
      {
        title: 'Not Now',
        type: 'outline',
        onPress: () => {
          OverlayModal.hide();
        },
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
          OverlayModal.hide();
          if (isDrawerOpen) {
            await sleep(250);
            dispatch(changeDrawerOpenStatus(false));
          }
        },
      },
    ];
  }, [accelerateChainId, dispatch, isDrawerOpen]);

  return (
    <View style={styles.alertBox}>
      <Image resizeMode="cover" source={securityWarning} style={styles.img} />
      <TextXL style={styles.alertTitle}>Upgrade Wallet Security Level</TextXL>
      <TextM style={styles.alertMessage}>
        {`You have too few guardians to protect your wallet. Please add at least one more guardian before proceeding.

Note: If you have tried to add a guardian and the action was not completed, please initiate the process again.`}
      </TextM>
      <ButtonRow buttons={buttons} />
    </View>
  );
}

const alert = async (accelerateChainId: ChainId) => {
  Keyboard.dismiss();
  OverlayModal.show(<AlertBody accelerateChainId={accelerateChainId} />, {
    modal: true,
    type: 'zoomOut',
    position: 'center',
  });
  await sleep(300);
};
export default {
  alert,
};

export const styles = StyleSheet.create({
  itemText: {
    color: defaultColors.primaryColor,
    fontSize: 16,
  },
  cancelText: {
    fontSize: pTd(16),
  },
  alertBox: {
    overflow: 'hidden',
    borderRadius: 8,
    alignItems: 'center',
    width: screenWidth - 48,
    backgroundColor: 'white',
    padding: pTd(24),
  },
  alertTitle: {
    textAlign: 'center',
    marginBottom: pTd(16),
    ...fonts.mediumFont,
  },
  alertMessage: {
    color: defaultColors.font3,
    marginBottom: pTd(12),
    textAlign: 'center',
  },
  img: {
    width: pTd(180),
    height: pTd(108),
    marginBottom: pTd(16),
  },
});
