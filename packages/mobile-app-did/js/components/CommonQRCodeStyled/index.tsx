import React, { useMemo } from 'react';
import QRCodeStyled, { SVGQRCodeStyledProps, useQRCodeData } from 'react-native-qrcode-styled';
import portkeyLogo from 'assets/image/pngs/portkey-v2-new-brand.png';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import { TextL } from 'components/CommonText';
import { defaultColors } from 'assets/theme';

type CommonQRCodeStyledPropsType = {
  qrData: string;
  hasMask?: boolean;
} & SVGQRCodeStyledProps;

const BorderRadiusMap = {
  style1: {
    outerBorderRadius: 17,
    innerBorderRadius: 8,
  },
  style2: {
    outerBorderRadius: 10,
    innerBorderRadius: 4,
  },
};

export default function CommonQRCodeStyled(props: CommonQRCodeStyledPropsType) {
  const { qrData, hasMask = false, width = pTd(236) } = props;
  const { qrCodeSize } = useQRCodeData(qrData, {});

  const pieceSize = useMemo(() => Number(width) / qrCodeSize, [qrCodeSize, width]);

  return (
    <View>
      {hasMask && (
        <View style={styles.mask}>
          <TextL>Updating...</TextL>
        </View>
      )}
      <QRCodeStyled
        data={qrData}
        padding={0}
        pieceSize={pieceSize}
        isPiecesGlued
        pieceBorderRadius={2}
        color={'#000000'}
        logo={{
          href: portkeyLogo,
          scale: 1.8,
          padding: pTd(0),
          hidePieces: false,
        }}
        outerEyesOptions={{
          topLeft: {
            borderRadius: BorderRadiusMap.style2.outerBorderRadius,
          },
          topRight: {
            borderRadius: BorderRadiusMap.style2.outerBorderRadius,
          },
          bottomLeft: {
            borderRadius: BorderRadiusMap.style2.outerBorderRadius,
          },
        }}
        innerEyesOptions={{
          topLeft: {
            borderRadius: BorderRadiusMap.style2.innerBorderRadius,
          },
          topRight: {
            borderRadius: BorderRadiusMap.style2.innerBorderRadius,
          },
          bottomLeft: {
            borderRadius: BorderRadiusMap.style2.innerBorderRadius,
          },
        }}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    zIndex: 99,
    top: -pTd(1),
    bottom: -pTd(1),
    left: -pTd(1),
    right: -pTd(1),
    backgroundColor: defaultColors.bg1,
    opacity: 0.96,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
