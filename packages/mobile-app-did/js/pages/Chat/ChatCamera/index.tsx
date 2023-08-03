import React, { useCallback, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleQRCodeData, invalidQRCode, InvalidQRCodeText, RouteInfoType } from 'utils/qrcode';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import GStyles from 'assets/theme/GStyles';
import { isIos, screenHeight, screenWidth } from '@portkey-wallet/utils/mobile/device';

import { Camera } from 'expo-camera';
import { expandQrData } from '@portkey-wallet/utils/qrCode';
import { checkIsUrl, prefixUrlWithProtocol } from '@portkey-wallet/utils/dapp/browser';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import Loading from 'components/Loading';
import { useThrottleCallback } from '@portkey-wallet/hooks';

const QrScanner: React.FC = () => {
  const { currentNetwork } = useWallet();
  const jumpToWebview = useDiscoverJumpWithNetWork();

  const navigation = useNavigation();
  const routesArr: RouteInfoType[] = navigation.getState().routes;
  const previousRouteInfo = routesArr[routesArr.length - 2];
  console.log(previousRouteInfo, '=====previousRouteInfo');

  const [refresh, setRefresh] = useState<boolean>();

  useFocusEffect(
    useCallback(() => {
      setRefresh(false);
    }, []),
  );

  const handleBarCodeScanned = useThrottleCallback(
    ({ data = '' }) => {
      if (typeof data !== 'string') return invalidQRCode(InvalidQRCodeText.INVALID_QR_CODE);

      try {
        const str = data.replace(/("|'|\s)/g, '');
        if (checkIsUrl(str)) {
          jumpToWebview({
            item: {
              name: prefixUrlWithProtocol(str),
              url: prefixUrlWithProtocol(str),
            },
          });
          return navigationService.goBack();
        }

        const qrCodeData = expandQrData(JSON.parse(data));
        // if not currentNetwork
        if (currentNetwork !== qrCodeData.netWorkType)
          return invalidQRCode(
            currentNetwork === 'MAIN' ? InvalidQRCodeText.SWITCH_TO_TESTNET : InvalidQRCodeText.SWITCH_TO_MAINNET,
          );

        handleQRCodeData(qrCodeData, previousRouteInfo, setRefresh);
      } catch (error) {
        console.log(error);
        return invalidQRCode(InvalidQRCodeText.INVALID_QR_CODE);
      } finally {
        Loading.hide();
      }
    },
    [currentNetwork, jumpToWebview, previousRouteInfo],
  );

  return (
    <View style={PageStyle.wrapper}>
      {refresh ? null : (
        <Camera
          ratio={'16:9'}
          style={[PageStyle.barCodeScanner, !isIos && PageStyle.barCodeScannerAndroid]}
          onBarCodeScanned={handleBarCodeScanned}>
          <SafeAreaView style={PageStyle.innerView}>
            <View style={PageStyle.iconWrap}>
              <Text style={PageStyle.leftBlock} />
              <TouchableOpacity
                style={PageStyle.svgWrap}
                onPress={() => {
                  navigationService.goBack();
                }}>
                <Svg icon="close1" size={pTd(14)} iconStyle={PageStyle.icon} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Camera>
      )}
    </View>
  );
};

export default QrScanner;

export const PageStyle = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
    backgroundColor: defaultColors.bgColor1,
  },
  barCodeScanner: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 100,
  },
  barCodeScannerAndroid: {
    width: screenWidth,
    height: screenHeight,
  },
  innerView: {
    width: '100%',
    height: '100%',
  },
  iconWrap: {
    marginTop: pTd(16),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  icon: {
    width: pTd(40),
  },
  svgWrap: {
    ...GStyles.paddingArg(16, 0, 16, 16),
  },
  scan: {
    marginTop: pTd(136),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    marginTop: pTd(62),
    fontSize: pTd(16),
    color: defaultColors.font2,
    textAlign: 'center',
  },
  tips: {
    // position: 'absolute',
    // bottom: 100,
    color: defaultColors.font7,
    textAlign: 'center',
    width: screenWidth,
    lineHeight: pTd(20),
    marginTop: pTd(54),
  },
  albumWrap: {
    position: 'absolute',
    bottom: pTd(75),
  },
  albumText: {
    marginTop: pTd(4),
    textAlign: 'center',
  },
  leftBlock: {
    flex: 1,
  },
});
