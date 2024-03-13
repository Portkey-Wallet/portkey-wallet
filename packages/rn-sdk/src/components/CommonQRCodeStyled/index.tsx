import React from 'react';
import QRCodeStyled, { SVGQRCodeStyledProps } from 'react-native-qrcode-styled';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import { TextL } from 'components/CommonText';

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
  const { qrData, hasMask = false } = props;

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
        pieceSize={4.8}
        isPiecesGlued
        pieceBorderRadius={2}
        color={'#000000'}
        logo={{
          href: require('assets/image/pngs/portkeyBlackBorderRadius.png'),
          scale: 1.5,
          padding: pTd(5),
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    opacity: 0.96,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
