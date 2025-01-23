import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import CommonButton from 'components/CommonButton';
import SafeAreaBox from 'components/SafeAreaBox';
import fonts from 'assets/theme/fonts';
import { darkColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import errorUrl from 'assets/image/pngs/error.png';
import { TextL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';

export interface IErrorBoundary {
  error: Error;
  componentStack: string | null;
  eventId?: string | null;
  resetError?(): void;
}

export type FallbackProps = IErrorBoundary;
export function Fallback({ resetError }: FallbackProps) {
  return (
    <SafeAreaBox edges={['left', 'top', 'right']} style={styles.bg}>
      <SafeAreaBox edges={['bottom']} style={styles.bg}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={[GStyles.flexCol, GStyles.flex1, GStyles.alignCenter, GStyles.spaceBetween, styles.contentWrap]}>
            <View style={GStyles.itemCenter}>
              <Image source={errorUrl} style={styles.errorImgWrap} />
              <View style={styles.errorText}>
                <Text style={styles.title}>Oops!</Text>
                <TextL style={styles.subTitle}>{'Just a minor hiccup. Your wallet is perfectly safe!'}</TextL>
              </View>
            </View>
            <CommonButton type="primary" onPress={resetError} title="Reload" />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaBox>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: darkColors.bgBase1,
  },
  title: {
    fontSize: pTd(32),
    textAlign: 'center',
    color: darkColors.textBase1,
    ...fonts.BGMediumFont,
  },
  subTitle: {
    color: darkColors.textBase2,
    textAlign: 'center',
    paddingTop: pTd(8),
  },
  errorText: {
    ...GStyles.paddingArg(24, 16),
  },
  contentWrap: {
    paddingTop: pTd(100),
  },
  errorImgWrap: {
    width: Dimensions.get('window').width,
    height: pTd(195),
    marginBottom: pTd(24),
  },
});
