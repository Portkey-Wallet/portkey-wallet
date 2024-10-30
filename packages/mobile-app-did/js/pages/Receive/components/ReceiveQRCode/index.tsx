import React, { useCallback } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import Touchable from 'components/Touchable';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import { makeStyles } from '@rneui/themed';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { copyText } from 'utils';

export default function ReceiveQRCode({
  data,
  address,
  style,
}: {
  data: string;
  address: string;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = getStyles();
  const onCopy = useCallback(async () => await copyText(address), [address]);
  return (
    <View style={[styles.container, style]}>
      <View style={styles.qrCodeWrap}>
        <CommonQRCodeStyled qrData={data} width={pTd(289)} style={styles.qrCode} />
      </View>
      <View style={styles.addressWrap}>
        <TextL>{formatStr2EllipsisStr(address, 8, 'middle')}</TextL>
        <Touchable style={styles.copyIcon} onPress={onCopy}>
          <Svg icon="copy" size={pTd(16)} />
        </Touchable>
      </View>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeWrap: {
    borderRadius: pTd(16),
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border1,
    backgroundColor: 'white',
    padding: pTd(15.6),
  },
  qrCode: {
    backgroundColor: theme.colors.iconBase1,
  },
  addressWrap: {
    marginTop: pTd(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyIcon: {
    marginLeft: pTd(4),
  },
}));
