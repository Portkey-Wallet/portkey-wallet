import React, { memo, useCallback, useMemo } from 'react';
import Svg from '../Svg';
import { useStyles } from './style';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from '../CommonText';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import AssetsOverlay from '../AssetsOverlay';
import GStyles from '../../theme/GStyles';
import Touchable from '../Touchable';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
  wrapStyle?: StyleProp<ViewProps>;
}

const SendButton = (props: SendButtonType) => {
  const { t } = useLanguage();
  const { themeType = 'dashBoard', sentToken, wrapStyle = {} } = props;
  const commonButtonStyle = useStyles();

  const buttonTitleStyle = useMemo(
    () =>
      themeType === 'dashBoard'
        ? commonButtonStyle.dashBoardTitleColorStyle
        : commonButtonStyle.innerPageTitleColorStyle,
    [themeType],
  );

  const onPressButton = useCallback(() => {
    if (themeType === 'innerPage')
      return navigationService.navigate('SendHome', {
        sendType: 'token',
        assetInfo: sentToken,
        toInfo: {
          name: '',
          address: '',
        },
      } as unknown as IToSendHomeParamsType);
    AssetsOverlay.showAssetList();
  }, [sentToken, themeType]);

  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <Touchable style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter, wrapStyle]} onPress={onPressButton}>
        <Svg icon={themeType === 'dashBoard' ? 'send' : 'send1'} size={pTd(46)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Send')}</TextM>
    </View>
  );
};

export default memo(SendButton);
