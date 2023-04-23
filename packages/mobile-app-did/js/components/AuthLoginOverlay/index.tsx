import { StyleSheet, View, Image, Keyboard, Linking } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { ModalBody } from 'components/ModalBody';
import React, { useCallback, useEffect, useState } from 'react';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import { TextM, TextXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import { useCurrentWalletInfo, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import { useGetCurrentCAContract } from 'hooks/contract';
import { addManager } from 'utils/wallet';
import { extraDataEncode, getDeviceInfoFromQR } from '@portkey-wallet/utils/device';
import socket from '@portkey-wallet/socket/socket-did';
import { request } from '@portkey-wallet/api/api-did';
import fonts from 'assets/theme/fonts';
import { useLanguage } from 'i18n/hooks';
import { defaultColors } from 'assets/theme';
import ActionSheet from 'components/ActionSheet';

const mockData = {
  chainType: 'aelf',
  type: 'login',
  address: 'Qx7j9zpxvp14Hz7UQMv7a28c7ftVgSTVnpQxDs2XhafrWQQ1R',
  netWorkType: 'TESTNET',
  extraData: { deviceInfo: { deviceType: 2, deviceName: 'iPhone' }, version: '2.0.0' },
} as LoginQRData;

function AuthLogin() {
  const { t } = useLanguage();

  const { address: managerAddress, extraData: qrExtraData, deviceType } = mockData || {};

  const { caHash, address } = useCurrentWalletInfo();
  const { currentNetwork } = useWallet();
  const [loading, setLoading] = useState<boolean>();
  const getCurrentCAContract = useGetCurrentCAContract();

  const showDialog = useCallback(
    (type?: 'networkError' | 'other') =>
      ActionSheet.alert({
        title: t('Authorization failed'),
        message:
          type === 'networkError'
            ? t('Network error, please switch Portkey app to the matching network.')
            : t("You weren't able to give access to the App. Go back and try logging in again."),
        buttons: [
          {
            title: t(type === 'networkError' ? 'OK' : 'Back'),
            type: 'solid',
          },
        ],
      }),
    [t],
  );

  const onLogin = useCallback(async () => {
    if (currentNetwork === mockData.netWorkType) return showDialog('networkError');
    if (!caHash || loading || !managerAddress) return showDialog();

    try {
      setLoading(true);
      const deviceInfo = getDeviceInfoFromQR(qrExtraData, deviceType);
      console.log('qrExtraData', qrExtraData, deviceType);
      console.log('deviceInfo', deviceInfo);
      const contract = await getCurrentCAContract();
      const extraData = await extraDataEncode(deviceInfo || {}, true);
      console.log('extraData===', extraData);

      const req = await addManager({ contract, caHash, address, managerAddress, extraData });
      if (req?.error) throw req?.error;
      socket.doOpen({
        url: `${request.defaultConfig.baseURL}/ca`,
        clientId: managerAddress,
      });
      navigationService.navigate('Tab');
    } catch (error) {
      CommonToast.failError(error);
    }
    setLoading(false);
  }, [
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
    <ModalBody modalBodyType="bottom" title="">
      <View style={[styles.topSection, GStyles.itemCenter]}>
        <View style={GStyles.flexRow}>
          <Image
            source={require('../../assets/image/pngs/portkeyBlueBackground.png')}
            style={[styles.baseImage, styles.portkeyImg]}
          />
          <Image source={require('../../assets/image/pngs/bingoGame.png')} style={[styles.baseImage]} />
        </View>
        <TextXXL style={[styles.title1, GStyles.textAlignCenter, fonts.mediumFont]}>
          {t('Authorize Bingogame to login ')}
        </TextXXL>
        <TextXXL style={[styles.title2, GStyles.textAlignCenter, fonts.mediumFont]}>{t('with your account')}</TextXXL>
        <TextM style={[styles.tips, FontStyles.font3, GStyles.textAlignCenter]}>
          {t('This application will be able to use your wallet account.')}
        </TextM>
      </View>
      <View style={styles.bottomBox}>
        <CommonButton type="primary" title={t('Allow')} onPress={onLogin} loading={loading} />
      </View>
    </ModalBody>
  );
}

export const showAuthLogin = () => {
  Keyboard.dismiss();
  OverlayModal.show(<AuthLogin />, {
    position: 'bottom',
  });
};

export default {
  showAuthLogin,
};

const styles = StyleSheet.create({
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
