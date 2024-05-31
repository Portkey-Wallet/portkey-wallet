import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View, Image, StyleSheet } from 'react-native';
import CommonButton from 'components/CommonButton';
import SafeAreaBox from 'components/SafeAreaBox';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { BGStyles } from 'assets/theme/styles';
import errorUrl from 'assets/image/pngs/error.png';
import { TextL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
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
    <SafeAreaBox edges={['left', 'top', 'right']} style={BGStyles.bg1}>
      <SafeAreaBox edges={['bottom']} style={BGStyles.bg1}>
        <View style={styles.headerWrap} />

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={[GStyles.flexCol, GStyles.flex1, GStyles.alignCenter, GStyles.spaceBetween, styles.contentWrap]}>
            <View style={GStyles.itemCenter}>
              <Image source={errorUrl} style={styles.errorImgWrap} />
              <TextL style={[FontStyles.font9, GStyles.textAlignCenter]}>
                {`Oops! We're having trouble displaying your information right now. But don't worry, your wallet and funds are safe and sound.`}
              </TextL>
            </View>
            <CommonButton type="primary" onPress={resetError} title="Reload" />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaBox>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    height: pTd(52),
    width: '100%',
    backgroundColor: defaultColors.bg1,
  },
  contentWrap: {
    paddingHorizontal: pTd(20),
    paddingTop: pTd(120),
    paddingBottom: pTd(16),
  },
  errorImgWrap: {
    width: pTd(160),
    height: pTd(140),
  },
});
