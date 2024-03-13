import React from 'react';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { useUnlockedWallet } from 'model/wallet';

export default function From() {
  const { t } = useLanguage();
  const { wallet } = useUnlockedWallet();

  return (
    <View style={styles.fromWrap}>
      <TextM style={styles.leftTitle}>{t('From')}</TextM>
      <TextM style={styles.middle}>{wallet?.name}</TextM>
    </View>
  );
}

export const styles = StyleSheet.create({
  fromWrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftTitle: {
    width: pTd(49),
    color: defaultColors.font3,
  },
  middle: {
    flex: 1,
    color: defaultColors.font5,
  },
  right: {
    width: pTd(17),
  },
});
