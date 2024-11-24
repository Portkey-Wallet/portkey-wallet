import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { TextH1 } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonPrompt from 'components/CommonPromptCard';
import { useGetCurrentCAContract } from 'hooks/contract';
import { addManager } from 'utils/wallet';
import { extraDataEncode, getDeviceInfoFromQR } from '@portkey-wallet/utils/device';
import socket from '@portkey-wallet/socket/socket-did';
import { request } from '@portkey-wallet/api/api-did';
import { checkQRCodeExist } from '@portkey-wallet/api/api-did/message/utils';
import { managerSpeed } from 'utils/manager';
import useEffectOnce from 'hooks/useEffectOnce';
import { LoginTrackTypeEnum, useLoginTrack } from 'hooks/amplitude';

const ScrollViewProps = { disabled: true };

export default function ScanLogin() {
  const { data } = useRouterParams<{ data?: LoginQRData }>();
  const { address: managerAddress, extraData: qrExtraData, deviceType, id } = data || {};

  const { caHash, address } = useCurrentWalletInfo();
  const [loading, setLoading] = useState<boolean>();
  const getCurrentCAContract = useGetCurrentCAContract();

  const targetClientId = useMemo(() => (id ? `${managerAddress}_${id}` : undefined), [managerAddress, id]);

  const loginTrack = useLoginTrack();
  useEffectOnce(() => {
    loginTrack({
      type: LoginTrackTypeEnum.Scan,
    });
  });

  const onLogin = useCallback(async () => {
    if (!caHash || loading || !managerAddress) {
      return;
    }
    setLoading(true);
    try {
      if (targetClientId) {
        const isQRCodeExist = await checkQRCodeExist(targetClientId);
        if (isQRCodeExist === false) {
          CommonPrompt.warn('The QR code has already been scanned by another device.');
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
      if (req?.error) {
        throw req?.error;
      }
      managerSpeed({ caHash, address, managerAddress, extraData });
      socket.doOpen({
        url: `${request.defaultConfig.baseURL}/ca`,
        clientId: managerAddress,
      });
      navigationService.navigate('Tab');
    } catch (error) {
      CommonPrompt.failError(error);
    }
    setLoading(false);
  }, [caHash, loading, managerAddress, targetClientId, qrExtraData, deviceType, getCurrentCAContract, address]);
  return (
    <PageContainer
      scrollViewProps={ScrollViewProps}
      titleDom
      containerStyles={styles.containerStyles}
      leftDom={
        <Touchable onPress={() => navigationService.navigate('Tab')}>
          <Svg size={pTd(16)} icon="close4" iconStyle={styles.svgStyle} />
        </Touchable>
      }>
      <TextH1 style={styles.title}>Confirm your login to Portkey</TextH1>
      <View style={styles.bottomBox}>
        <CommonButton type="primary" title="Confirm" onPress={onLogin} loading={loading} />
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
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    alignSelf: 'flex-start',
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
    paddingLeft: pTd(18),
  },
});
