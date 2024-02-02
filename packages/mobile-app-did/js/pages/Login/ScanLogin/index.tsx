import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { TextXXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import { useGetCurrentCAContract } from 'hooks/contract';
import { addManager } from 'utils/wallet';
import { extraDataEncode, getDeviceInfoFromQR } from '@portkey-wallet/utils/device';
import socket from '@portkey-wallet/socket/socket-did';
import { request } from '@portkey-wallet/api/api-did';
import { checkQRCodeExist } from '@portkey-wallet/api/api-did/message/utils';
import { managerSpeed } from 'utils/manager';

const ScrollViewProps = { disabled: true };

export default function ScanLogin() {
  const { data } = useRouterParams<{ data?: LoginQRData }>();
  const { address: managerAddress, extraData: qrExtraData, deviceType, id } = data || {};

  const { caHash, address } = useCurrentWalletInfo();
  const [loading, setLoading] = useState<boolean>();
  const getCurrentCAContract = useGetCurrentCAContract();

  const targetClientId = useMemo(() => (id ? `${managerAddress}_${id}` : undefined), [managerAddress, id]);

  const onLogin = useCallback(async () => {
    if (!caHash || loading || !managerAddress) return;
    setLoading(true);
    try {
      if (targetClientId) {
        const isQRCodeExist = await checkQRCodeExist(targetClientId);
        if (isQRCodeExist === false) {
          CommonToast.warn('The QR code has already been scanned by another device.');
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const deviceInfo = getDeviceInfoFromQR(qrExtraData, deviceType);
      const contract = await getCurrentCAContract();
      const extraData = await extraDataEncode(deviceInfo || {}, true);
      const req = await addManager({ contract, caHash, address, managerAddress, extraData });
      if (req?.error) throw req?.error;
      managerSpeed({ caHash, address, managerAddress, extraData });
      socket.doOpen({
        url: `${request.defaultConfig.baseURL}/ca`,
        clientId: managerAddress,
      });
      navigationService.navigate('Tab');
    } catch (error) {
      CommonToast.failError(error);
    }
    setLoading(false);
  }, [caHash, loading, managerAddress, targetClientId, qrExtraData, deviceType, getCurrentCAContract, address]);
  return (
    <PageContainer
      scrollViewProps={ScrollViewProps}
      titleDom
      leftDom
      containerStyles={styles.containerStyles}
      leftCallback={() => navigationService.navigate('Tab')}
      rightDom={
        <Touchable onPress={() => navigationService.navigate('Tab')}>
          <Svg size={pTd(14)} color={FontStyles.font3.color} icon="close" iconStyle={styles.svgStyle} />
        </Touchable>
      }>
      <View style={GStyles.itemCenter}>
        <Svg size={pTd(100)} icon="logo-icon" color={defaultColors.primaryColor} />
        <TextXXXL style={[styles.title, GStyles.textAlignCenter]}>Confirm Your Log In To Portkey</TextXXXL>
      </View>
      <View style={styles.bottomBox}>
        <CommonButton type="primary" title="Log In" onPress={onLogin} loading={loading} />
        <CommonButton
          buttonStyle={styles.cancelButtonStyle}
          type="clear"
          title="Cancel"
          onPress={() => navigationService.navigate('Tab')}
        />
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
  bottomBox: {
    width: '100%',
    marginHorizontal: 16,
  },
  cancelButtonStyle: {
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  svgStyle: {
    paddingRight: pTd(24),
  },
});
