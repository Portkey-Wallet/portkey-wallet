import React, { memo, useCallback } from 'react';
import Svg from 'components/Svg';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { commonButtonStyle } from '../SendButton/style';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';

type DepositButtonPropsType = {
  wrapStyle?: StyleProp<ViewProps>;
};

const DepositButton = (props: DepositButtonPropsType) => {
  const { t } = useLanguage();
  const { wrapStyle } = props;

  const onPress = useCallback(() => {
    navigationService.navigate('Deposit', {
      symbol: 'USDT',
      chainId: 'tDVV',
      imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-USDT.png',
    });
  }, []);

  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <Touchable style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]} onPress={onPress}>
        <Svg icon="depositMain" size={pTd(48)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, commonButtonStyle.dashBoardTitleColorStyle]}>
        {t('Deposit')}
      </TextM>
    </View>
  );
};

export default memo(DepositButton);
