import React, { memo } from 'react';
import Svg from 'components/Svg';
import { dashBoardBtnStyle, innerPageStyles } from './style';
import navigationService from 'utils/navigationService';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

import { View, TouchableOpacity } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
}

const BuyButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard' } = props;
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;
  const isMainnet = useIsMainnet();
  const { t } = useLanguage();

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        style={[styles.iconWrapStyle, GStyles.alignCenter]}
        onPress={async () => {
          if (!isMainnet) return;
          navigationService.navigate('BuyHome');
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'buy' : 'buy1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Buy')}</TextM>
    </View>
  );
};

export default memo(BuyButton);
