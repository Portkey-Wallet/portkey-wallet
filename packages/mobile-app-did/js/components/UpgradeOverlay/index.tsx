import React, { useCallback, useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { TextTitle, TextM } from 'components/CommonText';
import { View, Image, Linking } from 'react-native';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import upGradeApp from 'assets/image/pngs/upGradeApp.png';
import CommonButton from 'components/CommonButton';
import { isIOS, screenWidth } from '@portkey-wallet/utils/mobile/device';
import navigationService from 'utils/navigationService';
import myEvents from 'utils/deviceEvent';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { request } from '@portkey-wallet/api/api-did';
import { useServiceSuspension } from '@portkey-wallet/hooks/hooks-ca/cms';
import { handleLoopFetch } from '@portkey-wallet/utils';
export type ShowUpgradeOverlayPropsType = {
  type?: 'dashBoard' | 'chat' | 'chat-detail' | 'my';
};

function UpgradeOverlay(props: ShowUpgradeOverlayPropsType) {
  const { type = 'dashBoard' } = props;
  const serviceSuspension = useServiceSuspension();

  const commonAction = useLockCallback(async () => {
    switch (type) {
      case 'dashBoard' || 'my':
        try {
          await request.wallet.setSuspendV1Info({ params: { version: 'V1' } });
        } catch (error) {
          console.log('error', error);
        }

        break;

      case 'chat-detail':
        myEvents.navToBottomTab.emit({ tabName: 'Wallet' });
        navigationService.navigate('Tab');
        break;
      case 'chat':
        break;

      default:
        break;
    }
  }, [type]);

  const onDownLoad = useLockCallback(async () => {
    await commonAction();
    Linking.openURL(isIOS ? serviceSuspension?.iOSUrl || '' : serviceSuspension?.androidUrl || '');
    OverlayModal.hide();
  }, [commonAction]);

  const onNotNow = useCallback(async () => {
    await commonAction();
    OverlayModal.hide();
  }, [commonAction]);

  const content = useMemo(() => {
    if (type === 'dashBoard' || type === 'my') {
      return (
        <>
          <TextM style={styles.textStyle}>
            {`• Portkey unveiled a fully upgraded version with exciting features like keeping user addresses identical on MainChain and SideChains. We warmly invite you to download it for an enhanced experience.`}
          </TextM>
          <View style={styles.blank} />
          <TextM style={styles.textStyle}>
            {`• If you choose to stick with the current Portkey, rest assured that your accounts and assets will stay safe, yet the services won't receive any further upgrades.`}
          </TextM>
        </>
      );
    }

    return (
      <TextM style={styles.textStyle}>
        {`Portkey unveiled a fully upgraded version with exciting features. The current Portkey will no longer support the chat function, if you want to continue to use this function, please download the upgraded version.`}
      </TextM>
    );
  }, [type]);

  return (
    <View style={styles.alertBox}>
      <Image source={upGradeApp} style={styles.imageWrap} />
      <View style={styles.contentWrap}>
        <TextTitle style={styles.titleStyle}>Portkey Upgraded</TextTitle>
        {content}
        <View style={styles.btnWrap}>
          <CommonButton title="Download" type="primary" onPress={onDownLoad} />
          <CommonButton
            title="Not Now"
            containerStyle={styles.notNowContainerStyle}
            buttonStyle={styles.notNowButtonStyle}
            titleStyle={styles.notNowTitleStyle}
            onPress={onNotNow}
          />
        </View>
      </View>
    </View>
  );
}

export const showUpgradeOverlay = async (props: ShowUpgradeOverlayPropsType) => {
  const { type } = props;
  let shouldShow = true;

  if (type === 'dashBoard') {
    try {
      const { isPopup } = await handleLoopFetch<{ isPopup: boolean }>({
        fetch: () => request.wallet.getSuspendV1Info({ params: { version: 'V1' } }),
        times: 5,
        interval: 1500,
      });

      shouldShow = !isPopup;
    } catch (error) {
      console.log('error', error);
      shouldShow = true;
    }
  }

  if (!shouldShow) return;

  OverlayModal.show(<UpgradeOverlay {...props} />, {
    position: 'center',
    animated: false,
  });
};

export default {
  showUpgradeOverlay,
};

export const styles = StyleSheet.create({
  alertBox: {
    overflow: 'hidden',
    borderRadius: 8,
    alignItems: 'center',
    width: screenWidth - 48,
    backgroundColor: 'white',
  },
  imageWrap: {
    width: pTd(328),
    height: pTd(128),
  },
  contentWrap: {
    paddingHorizontal: pTd(24),
    paddingBottom: pTd(16),
    alignItems: 'center',
    width: '100%',
  },
  titleStyle: {
    lineHeight: pTd(22),
    fontSize: pTd(18),
    marginBottom: pTd(16),
  },
  blank: {
    height: pTd(12),
  },
  textStyle: {
    textAlign: 'left',
    lineHeight: pTd(20),
    fontSize: pTd(14),
    color: defaultColors.font3,
  },
  btnWrap: {
    width: '100%',
    marginTop: pTd(24),
  },
  notNowContainerStyle: {
    marginTop: pTd(8),
    backgroundColor: 'white',
  },
  notNowButtonStyle: {
    backgroundColor: 'transparent',
  },
  notNowTitleStyle: {
    color: defaultColors.font4,
  },
});
