import React, { useCallback, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import Touchable from 'components/Touchable';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import { makeStyles } from '@rneui/themed';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { copyText } from 'utils';
import fonts from 'assets/theme/fonts';

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
  const addressShow = useMemo(() => {
    let num = 4;
    if (address.includes('_')) {
      num = 8;
    }
    return formatStr2EllipsisStr(address, num, 'middle');
  }, [address]);
  return (
    <View style={[styles.container, style]}>
      <View style={styles.qrCodeWrap}>
        <CommonQRCodeStyled qrData={data} width={pTd(289)} style={styles.qrCode} />
      </View>
      <Touchable style={styles.addressWrap} onPress={onCopy}>
        <TextL style={[fonts.SGMediumFont]}>{addressShow}</TextL>
        <View style={styles.copyIcon}>
          <Svg icon="copy" size={pTd(16)} />
        </View>
      </Touchable>
    </View>
  );
}

const getStyles = makeStyles((theme: any) => ({
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
