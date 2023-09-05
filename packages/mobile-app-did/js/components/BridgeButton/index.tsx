import React, { memo } from 'react';
import Svg from 'components/Svg';
import navigationService from 'utils/navigationService';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';

const BuyButton = () => {
  const { t } = useLanguage();

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        style={[styles.iconWrapStyle, GStyles.alignCenter]}
        onPress={async () => {
          navigationService.navigate('BuyHome');
        }}>
        <Svg icon="Contract" size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Bridge')}</TextM>
    </View>
  );
};

export default memo(BuyButton);

export const styles = StyleSheet.create({
  buttonWrap: {
    marginBottom: pTd(24),
    width: pTd(54),
  },
  iconWrapStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    width: '100%',
    marginTop: pTd(4),
    textAlign: 'center',
    color: defaultColors.font2,
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
});
