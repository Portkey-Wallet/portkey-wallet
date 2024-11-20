import React, { useMemo } from 'react';
import QRCodeStyled, { SVGQRCodeStyledProps, useQRCodeData } from 'react-native-qrcode-styled';
import portkeyLogo from 'assets/image/pngs/portkey-v2-new-brand-2.png';
import { pTd } from 'utils/unit';
import { View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import Lottie from 'lottie-react-native';

type CommonQRCodeStyledPropsType = {
  qrData: string;
  hasMask?: boolean;
} & SVGQRCodeStyledProps;

// const BorderRadiusMap = {
//   style1: {
//     outerBorderRadius: 17,
//     innerBorderRadius: 8,
//   },
//   style2: {
//     outerBorderRadius: 10,
//     innerBorderRadius: 4,
//   },
// };

export default function CommonQRCodeStyled(props: CommonQRCodeStyledPropsType) {
  const styles = getStyles();
  const { qrData, hasMask = false, width = pTd(236) } = props;
  const { qrCodeSize } = useQRCodeData(qrData, {});

  const pieceSize = useMemo(() => Number(width) / qrCodeSize, [qrCodeSize, width]);

  return (
    <View>
      {hasMask && (
        <View style={styles.mask}>
          <Lottie style={styles.loadingIcon} source={require('assets/lottieFiles/spinnerDark.json')} autoPlay loop />
        </View>
      )}
      <QRCodeStyled
        data={qrData}
        padding={0}
        pieceSize={pieceSize}
        isPiecesGlued={false}
        pieceBorderRadius={pieceSize / 2}
        color={'#000000'}
        logo={{
          href: portkeyLogo,
          width: pTd(64),
          height: pTd(64),
          scale: 3.5,
          padding: pTd(0),
          hidePieces: false,
        }}
        outerEyesOptions={{
          strokeWidth: pTd(6),
          borderRadius: pTd(18),
        }}
        innerEyesOptions={{
          borderRadius: pTd(8),
        }}
        {...props}
      />
    </View>
  );
}

const getStyles = makeStyles((theme: any) => ({
  mask: {
    position: 'absolute',
    zIndex: 99,
    top: -pTd(1),
    bottom: -pTd(1),
    left: -pTd(1),
    right: -pTd(1),
    backgroundColor: theme.colors.iconBase1,
    opacity: 0.96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskText: {
    color: theme.colors.bgBase1,
  },
  loadingIcon: {
    width: pTd(32),
  },
}));
