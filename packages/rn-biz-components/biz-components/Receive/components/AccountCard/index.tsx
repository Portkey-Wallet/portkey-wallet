import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { ScreenWidth } from '@rneui/base';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { shrinkSendQrData, QRCodeDataObjType } from '@portkey-wallet/utils/qrCode';
import CommonQRCodeStyled from '@portkey-wallet/rn-components/components/CommonQRCodeStyled';

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
  const { chainType } = useCurrentNetwork();
  const currentNetWork = useCurrentNetworkInfo();

  const info: QRCodeDataObjType = {
    address: toCaAddress,
    networkType: currentNetWork.networkType,
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
      <CommonQRCodeStyled qrData={JSON.stringify(shrinkSendQrData(info))} width={pTd(236)} />
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
    shadowRadius: 5,
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
