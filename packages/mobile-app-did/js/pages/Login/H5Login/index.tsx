import React, { useCallback, useState } from 'react';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { FontStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import { TextM, TextXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
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

const ScrollViewProps = { disabled: true };
export default function ScanLogin() {
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
          type === 'networkError' ? t('Network error, please switch Portkey app to the matching network.') : undefined,
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
    if (currentNetwork !== mockData.netWorkType) return showDialog('networkError');
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
    <PageContainer
      safeAreaColor={['white', 'white']}
      scrollViewProps={ScrollViewProps}
      titleDom
      leftDom={
        <TouchableOpacity onPress={() => navigationService.navigate('Tab')} style={styles.iconWrap}>
          <Svg color={defaultColors.icon1} icon={'left-arrow'} size={pTd(20)} iconStyle={GStyles.marginRight(4)} />
        </TouchableOpacity>
      }
      containerStyles={styles.containerStyles}>
      <View style={GStyles.itemCenter}>
        <View style={GStyles.flexRow}>
          <Image
            source={require('../../../assets/image/pngs/portkeyBlueBackground.png')}
            style={[styles.baseImage, styles.portkeyImg]}
          />
          <Image source={require('../../../assets/image/pngs/bingoGame.png')} style={[styles.baseImage]} />
        </View>
        <TextXXL style={[styles.title, GStyles.textAlignCenter, fonts.mediumFont]}>
          {t('Authorized login to Bingogame')}
        </TextXXL>
        <TextM style={[styles.tips, FontStyles.font3, GStyles.textAlignCenter]}>
          {t('Once authorized, your wallet information will be synchronized with bingogame.')}
        </TextM>
      </View>
      <View style={styles.bottomBox}>
        <CommonButton type="primary" title="Confirm" onPress={onLogin} loading={loading} />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    justifyContent: 'space-between',
    paddingBottom: 32,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    marginTop: 41,
  },
  tips: {
    marginTop: pTd(16),
  },
  loginTypeIcon: {
    width: pTd(64),
  },
  bottomBox: {
    width: '100%',
    marginHorizontal: 16,
  },
  cancelButtonStyle: {
    marginTop: 8,
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
