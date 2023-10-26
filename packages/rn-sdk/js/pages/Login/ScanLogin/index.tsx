import React, { useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import { TextXXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import socket from '@portkey-wallet/socket/socket-did';
import CommonToast from 'components/CommonToast';
import { LoginQRData } from '@portkey-wallet/types/types-ca/qrcode';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { NetworkController } from 'network/controller';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { addManager } from 'utils/wallet';
import { extraDataEncode, getDeviceInfoFromQR } from '@portkey-wallet/utils/device';
import { PortkeyConfig } from 'global';
import { getUnlockedWallet } from 'model/wallet';
import { AElfWeb3SDK } from 'network/dto/wallet';

const ScrollViewProps = { disabled: true };

export default function ScanLogin(props: ScanToLoginProps) {
  const { data } = props;
  const parsed: LoginQRData = useMemo(() => JSON.parse(data), [data]);
  const { address: managerAddress, extraData: qrExtraData, id, deviceType } = parsed || {};
  const [loading, setLoading] = useState<boolean>();

  const { onFinish } = useBaseContainer({
    entryName: PortkeyEntries.SCAN_LOG_IN,
  });

  const targetClientId = useMemo(() => (id ? `${managerAddress}_${id}` : undefined), [managerAddress, id]);

  const onLogin = async () => {
    try {
      setLoading(true);
      const { caInfo, currChainNetworkConfig, address, privateKey } = (await getUnlockedWallet()) || {};
      const caHash = caInfo?.caHash;
      const { caContractAddress, peerUrl } = currChainNetworkConfig || {};
      if (!caHash || !caContractAddress || !peerUrl || !address || loading || !managerAddress) {
        CommonToast.warn('params error:');
        console.log('params error:', caHash, caContractAddress, peerUrl, address, loading, managerAddress);
        return;
      }
      if (targetClientId) {
        console.log('targetClientId:', targetClientId);
        const isQRCodeExist = await NetworkController.checkQrCodeStatus(targetClientId);
        if (isQRCodeExist === false) {
          CommonToast.warn('The QR code has already been scanned by another device.');
          setLoading(false);
          return;
        }
        const contractInstance = await getContractBasic({
          contractAddress: caContractAddress,
          rpcUrl: peerUrl,
          account: AElfWeb3SDK.getWalletByPrivateKey(privateKey),
        });
        const deviceInfo = getDeviceInfoFromQR(qrExtraData, deviceType);
        const extraData = await extraDataEncode(deviceInfo || {}, true);
        const req = await addManager({
          contract: contractInstance,
          caHash,
          address,
          managerAddress,
          extraData,
        });
        if (req?.error) throw req?.error;
        socket.doOpen({
          url: `${await PortkeyConfig.endPointUrl()}/ca`,
          clientId: managerAddress,
        });
        CommonToast.success('Login success');
        setTimeout(() => {
          onFinish({ status: 'success', data: {} });
        }, 1000);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <PageContainer
      scrollViewProps={ScrollViewProps}
      titleDom
      leftDom
      containerStyles={styles.containerStyles}
      leftCallback={() => onFinish({ status: 'cancel', data: {} })}
      rightDom={
        <Touchable onPress={() => onFinish({ status: 'cancel', data: {} })}>
          <Svg size={pTd(14)} color={FontStyles.font3.color} icon="close" iconStyle={styles.svgStyle} />
        </Touchable>
      }>
      <View style={[GStyles.itemCenter]}>
        <Svg size={pTd(100)} icon="logo-icon" color={defaultColors.primaryColor} />
        <TextXXXL style={[styles.title, GStyles.textAlignCenter]}>Confirm Your Log In To Portkey</TextXXXL>
      </View>
      <View style={styles.bottomBox}>
        <CommonButton type="primary" title="Log In" onPress={onLogin} loading={loading} />
        <CommonButton
          buttonStyle={styles.cancelButtonStyle}
          type="clear"
          title="Cancel"
          onPress={() => onFinish({ status: 'cancel', data: {} })}
        />
      </View>
    </PageContainer>
  );
}

export interface ScanToLoginProps {
  data: string; // LoginQRData
}

const styles = StyleSheet.create({
  containerStyles: {
    justifyContent: 'space-between',
    paddingBottom: 32,
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    marginTop: 41,
  },
  bottomBox: {
    width: '100%',
    marginTop: 96,
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
