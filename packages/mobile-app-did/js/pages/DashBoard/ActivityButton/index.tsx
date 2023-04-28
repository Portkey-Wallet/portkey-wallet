import React, { memo } from 'react';
import Svg from 'components/Svg';
import { dashBoardBtnStyle, innerPageStyles } from '../../../components/SendButton/style';
import navigationService from 'utils/navigationService';

import { View, TouchableOpacity } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';

interface ActivityButtonProps {
  themeType?: 'dashBoard' | 'innerPage';
}

const ActivityButton = (props: ActivityButtonProps) => {
  const { themeType = 'dashBoard' } = props;
  const { t } = useLanguage();
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        style={[styles.iconWrapStyle, GStyles.alignCenter]}
        onPress={() => {
          return navigationService.navigate('ActivityListPage');
        }}>
        <Svg icon={'activity'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Activity')}</TextM>
    </View>
  );
};

export default memo(ActivityButton);
