import React, { memo } from 'react';
import Svg from 'components/Svg';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { commonButtonStyle } from '../SendButton/style';
import Touchable from 'components/Touchable';
import DepositOverlay from 'components/DepositOverlay';
import OverlayModal from 'components/OverlayModal';
import { DepositItem } from 'hooks/deposit';
import { pTd } from 'utils/unit';

type DepositButtonPropsType = {
  wrapStyle?: StyleProp<ViewProps>;
  list: DepositItem[];
};

const DepositButton = (props: DepositButtonPropsType) => {
  const { t } = useLanguage();
  const { wrapStyle, list } = props;

  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <Touchable
        style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]}
        onPress={() => {
          OverlayModal.hide();
          DepositOverlay.show({ list });
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
