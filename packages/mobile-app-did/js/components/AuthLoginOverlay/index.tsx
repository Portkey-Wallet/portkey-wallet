import { StyleSheet, View, Image, Keyboard } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { ModalBody } from 'components/ModalBody';
import React, { useCallback, useState } from 'react';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import { TextM, TextXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import { useCurrentWalletInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import { useGetCurrentCAContract } from 'hooks/contract';
import { addManager } from 'utils/wallet';
import { extraDataEncode, getDeviceInfoFromQR } from '@portkey-wallet/utils/device';
import fonts from 'assets/theme/fonts';
import { useLanguage } from 'i18n/hooks';
import { defaultColors } from 'assets/theme';
import ActionSheet from 'components/ActionSheet';
import * as minimizer from 'react-native-minimizer';
import { windowHeight } from '@portkey-wallet/utils/mobile/device';
import { AUTH_LOGIN_MAP } from 'constants/scheme';
import { getFaviconUrlFromDomain } from 'utils';

export interface AuthLoginOverlayPropsTypes {
  domain: string;
  loginData: LoginQRData;
  extraData: { websiteName: string; websiteIcon?: string };
}

function ThirdAuthImage({ websiteIcon, domain, style }: { websiteIcon?: string; domain: string; style?: any }) {
  const [isLoadError, setIsLoadError] = useState<boolean>(false);

  if (isLoadError) return <Image source={AUTH_LOGIN_MAP.Other?.imgUrl} style={style} />;

  return (
    <Image
      source={{ uri: websiteIcon ? websiteIcon : getFaviconUrlFromDomain(domain || '') }}
      style={style}
      onError={() => setIsLoadError(true)}
    />
  );
}

function AuthLogin({ loginData, domain, extraData: websiteInfo }: AuthLoginOverlayPropsTypes) {
  const { t } = useLanguage();

  const { address: managerAddress, extraData: qrExtraData, deviceType } = loginData || {};

  const { caHash, address } = useCurrentWalletInfo();
  const { currentNetwork } = useWallet();
  const [loading, setLoading] = useState<boolean>();
  const getCurrentCAContract = useGetCurrentCAContract();

  const showDialog = useCallback(
    () =>
      ActionSheet.alert({
        title: t('Authorization failed'),
        message: t('Network error, please switch Portkey app to the matching network.'),
        buttons: [
          {
            title: t('OK'),
            type: 'solid',
          },
        ],
      }),
    [t],
  );

  const onLogin = useCallback(async () => {
    if (currentNetwork !== loginData.netWorkType) return showDialog();
    if (!caHash || loading || !managerAddress) return showDialog();

    try {
      setLoading(true);
      const deviceInfo = getDeviceInfoFromQR(qrExtraData, deviceType);
      const contract = await getCurrentCAContract();
      const extraData = await extraDataEncode(deviceInfo || {}, true);

      const req = await addManager({ contract, caHash, address, managerAddress, extraData });
      if (req?.error) throw req?.error;

      OverlayModal.hide();
      minimizer.goBack();
    } catch (error) {
      CommonToast.failError(error);
    }
    setLoading(false);
  }, [
    loginData,
    currentNetwork,
    showDialog,
    caHash,
    loading,
    managerAddress,
    qrExtraData,
    deviceType,
    getCurrentCAContract,
    address,
  ]);

  return (
    <ModalBody modalBodyType="bottom" title="" style={styles.modal} onClose={minimizer.goBack}>
      <View style={[styles.topSection, GStyles.itemCenter]}>
        <View style={GStyles.flexRow}>
          <Image
            source={require('../../assets/image/pngs/portkeyBlueBackground.png')}
            style={[styles.baseImage, styles.portkeyImg]}
          />
          <ThirdAuthImage domain={domain} websiteIcon={websiteInfo.websiteIcon} style={styles.baseImage} />
        </View>
        <TextXXL style={[styles.title1, GStyles.textAlignCenter, fonts.mediumFont]}>
          {t(`Authorize ${websiteInfo?.websiteName} to login`)}
        </TextXXL>
        <TextXXL style={[styles.title2, GStyles.textAlignCenter, fonts.mediumFont]}>{t('with your account')}</TextXXL>
        <TextM style={[styles.tips, FontStyles.font3, GStyles.textAlignCenter]}>
          {t('This application will be able to use your wallet account.')}
        </TextM>
      </View>
      <View style={GStyles.flex1} />
      <View style={styles.bottomBox}>
        <CommonButton type="primary" title={t('Allow')} onPress={onLogin} loading={loading} />
      </View>
    </ModalBody>
  );
}

export const showAuthLogin = (props: AuthLoginOverlayPropsTypes) => {
  Keyboard.dismiss();
  OverlayModal.show(<AuthLogin {...props} />, {
    position: 'bottom',
  });
};

export default {
  showAuthLogin,
};

const styles = StyleSheet.create({
  modal: {
    height: windowHeight * 0.6,
  },
  itemRow: {
    height: 72,
    paddingLeft: pTd(20),
    alignItems: 'center',
    flexDirection: 'row',
  },
  disableItem: {
    opacity: 0.3,
  },
  nameRow: {
    flex: 1,
    marginLeft: pTd(12),
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  borderBottom1: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nameText: {
    flex: 1,
    marginRight: 50,
  },
  selectIconStyle: {
    position: 'absolute',
    right: pTd(22),
  },
  containerStyles: {
    justifyContent: 'space-between',
    paddingBottom: 32,
    paddingTop: 100,
    alignItems: 'center',
  },
  topSection: {
    marginTop: pTd(40),
  },
  title1: {
    marginTop: 41,
  },
  title2: {
    marginTop: 0,
  },
  tips: {
    marginTop: pTd(16),
  },
  loginTypeIcon: {
    width: pTd(64),
  },
  bottomBox: {
    marginTop: pTd(80),
    marginHorizontal: pTd(16),
  },
  cancelButtonStyle: {
    marginTop: pTd(8),
    backgroundColor: 'transparent',
  },
  baseImage: {
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(32),
    borderWidth: pTd(3),
    borderColor: defaultColors.bg1,
  },
  portkeyImg: {
    zIndex: 2,
    width: pTd(64),
    height: pTd(64),
    marginRight: -pTd(12),
  },
  iconWrap: {
    marginLeft: pTd(21),
  },
});
