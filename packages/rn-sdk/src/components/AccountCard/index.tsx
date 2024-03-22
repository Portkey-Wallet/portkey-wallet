import { ScreenWidth } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { shrinkSendQrData, QRCodeDataObjType } from '@portkey-wallet/utils/qrCode';
import CommonQRCodeStyled from '@portkey-wallet/rn-components/components/CommonQRCodeStyled';
import { useCurrentNetworkInfo, useDefaultChainType } from '../../hooks/network';

const cardWidth = ScreenWidth * 0.63;

export default function AccountCard({
  tokenInfo,
  toCaAddress,
  style,
}: {
  tokenInfo: TokenItemShowType;
  toCaAddress: string;
  style?: StyleProp<ViewStyle>;
}) {
  const chainType = useDefaultChainType();
  const currentNetWork = useCurrentNetworkInfo();

  const info: QRCodeDataObjType = {
    address: toCaAddress,
    networkType: currentNetWork,
    chainType,
    type: 'send',
    toInfo: {
      name: '',
      address: toCaAddress,
    },
    assetInfo: {
      symbol: tokenInfo?.symbol,
      tokenContractAddress: tokenInfo?.tokenContractAddress || tokenInfo?.address,
      chainId: tokenInfo?.chainId,
      decimals: tokenInfo?.decimals || 0,
    },
  };

  return (
    <View style={[styles.container, style]}>
      <CommonQRCodeStyled qrData={JSON.stringify(shrinkSendQrData(info))} />
      <TextM style={styles.textStyle}>{toCaAddress}</TextM>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    margin: pTd(10),
    backgroundColor: defaultColors.bg1,
    padding: pTd(16),
    borderRadius: pTd(12),
    // Shadow
    shadowColor: defaultColors.shadow1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  textStyle: {
    marginTop: pTd(10),
    width: cardWidth,
    fontSize: 14,
    color: defaultColors.font3,
  },
  logoBox: {
    position: 'absolute',
    zIndex: 99,
    padding: pTd(6),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
    alignSelf: 'center',
    top: ScreenWidth * 0.3,
  },
});
