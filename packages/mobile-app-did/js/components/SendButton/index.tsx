import React, { memo, useCallback, useMemo } from 'react';
import Svg from 'components/Svg';
import { commonButtonStyle } from './style';
import navigationService from 'utils/navigationService';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextS } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import AssetsOverlay from 'pages/DashBoard/AssetsOverlay';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
  wrapStyle?: StyleProp<ViewProps>;
}

const SendButton = (props: SendButtonType) => {
  const { t } = useLanguage();
  const { themeType = 'dashBoard', sentToken, wrapStyle = {} } = props;

  const buttonTitleStyle = useMemo(
    () =>
      themeType === 'dashBoard'
        ? commonButtonStyle.dashBoardTitleColorStyle
        : commonButtonStyle.innerPageTitleColorStyle,
    [themeType],
  );

  // const onPressButton = useCallback(() => {
  //   navigationService.navigate('Market');
  // }, []);
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
        <Svg icon={themeType === 'dashBoard' ? 'send' : 'send1'} size={pTd(48)} />
      </Touchable>
      <TextS style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Send')}</TextS>
    </View>
  );
};

export default memo(SendButton);
