import React, { memo } from 'react';
import Svg from 'components/Svg';
import { View, TouchableOpacity, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { commonButtonStyle } from '../SendButton/style';

type BridgeButtonPropsType = {
  wrapStyle?: StyleProp<ViewProps>;
};

const BridgeButton = (props: BridgeButtonPropsType) => {
  const { wrapStyle = {} } = props;
  const { t } = useLanguage();

  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <TouchableOpacity style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]}>
        <Svg icon="send" size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={[commonButtonStyle.commonTitleStyle, commonButtonStyle.dashBoardTitleColorStyle]}>
        {t('Bridge')}
      </TextM>
    </View>
  );
};

export default memo(BridgeButton);
