import React, { memo } from 'react';
import CommonSvg from '@portkey-wallet/rn-components/components/Svg';

import { View, TouchableOpacity, StyleProp, ViewProps } from 'react-native';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import dashBoardBtnStyle, { innerPageStyles } from 'components/FaucetButton/style';

interface ActivityButtonProps {
  themeType?: 'dashBoard' | 'innerPage';
  entryName?: string;
  wrapStyle?: StyleProp<ViewProps>;
}

const ActivityButton = (props: ActivityButtonProps) => {
  const { themeType = 'dashBoard', entryName = 'UNKNOWN', wrapStyle = {} } = props;
  const { t } = useLanguage();
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;
  const { navigateTo } = useBaseContainer({ entryName });

  return (
    <View style={[styles.buttonWrap, wrapStyle]}>
      <TouchableOpacity
        style={[styles.iconWrapStyle, GStyles.alignCenter]}
        onPress={() => {
          navigateTo(PortkeyEntries.ACTIVITY_LIST_ENTRY);
        }}>
        <CommonSvg icon={'activity'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Activity')}</TextM>
    </View>
  );
};

export default memo(ActivityButton);
