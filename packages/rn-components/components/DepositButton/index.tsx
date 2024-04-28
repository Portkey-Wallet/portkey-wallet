import React, { memo } from 'react';
import Svg from '../Svg';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from '../CommonText';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { useStyles } from '../SendButton/style';
import Touchable from '../Touchable';
import DepositOverlay from '../DepositOverlay';
import OverlayModal from '../OverlayModal';
import { DepositItem } from '@portkey-wallet/rn-base/hooks/deposit';
import GStyles from '../../theme/GStyles';

type DepositButtonPropsType = {
  wrapStyle?: StyleProp<ViewProps>;
  list: DepositItem[];
};

const DepositButton = (props: DepositButtonPropsType) => {
  const { t } = useLanguage();
  const { wrapStyle, list } = props;
  const commonButtonStyle = useStyles();
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
