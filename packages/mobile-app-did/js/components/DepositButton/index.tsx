import React, { memo } from 'react';
import Svg from 'components/Svg';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { commonButtonStyle } from '../SendButton/style';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { DepositModalMap, useOnDisclaimerModalPress } from 'hooks/deposit';

type DepositButtonPropsType = {
  wrapStyle?: StyleProp<ViewProps>;
  depositUrl: string;
};

const DepositButton = (props: DepositButtonPropsType) => {
  const { t } = useLanguage();
  const { wrapStyle, depositUrl } = props;

  const onDisclaimerModalPress = useOnDisclaimerModalPress();

  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <Touchable
        style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]}
        onPress={() => {
          onDisclaimerModalPress(DepositModalMap.eTransfer, depositUrl);
        }}>
        <Svg icon="depositMain" size={pTd(48)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, commonButtonStyle.dashBoardTitleColorStyle]}>
        {t('Deposit')}
      </TextM>
    </View>
  );
};

export default memo(DepositButton);
