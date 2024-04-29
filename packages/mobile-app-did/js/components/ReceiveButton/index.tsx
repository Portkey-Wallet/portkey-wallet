import React, { useMemo } from 'react';
import Svg from 'components/Svg';
import { StyleProp, View, ViewProps } from 'react-native';
import { commonButtonStyle } from '../SendButton/style';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import TokenOverlay from 'components/TokenOverlay';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';

interface SendButtonType {
  currentTokenInfo?: TokenItemShowType;
  themeType?: 'dashBoard' | 'innerPage';
  wrapStyle?: StyleProp<ViewProps>;
}

export default function ReceiveButton(props: SendButtonType) {
  const { themeType = 'dashBoard', currentTokenInfo = {}, wrapStyle = {} } = props;
  const { t } = useLanguage();

  const buttonTitleStyle = useMemo(
    () =>
      themeType === 'dashBoard'
        ? commonButtonStyle.dashBoardTitleColorStyle
        : commonButtonStyle.innerPageTitleColorStyle,
    [themeType],
  );

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={[commonButtonStyle.buttonWrap, wrapStyle, themeType === 'dashBoard' ? { marginBottom: pTd(32) } : {}]}>
      <Touchable
        style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]}
        onPress={() => {
          if (themeType === 'innerPage') return navigationService.navigate('Receive', currentTokenInfo);

          TokenOverlay.showTokenList({
            onFinishSelectToken: (tokenInfo: TokenItemShowType) => {
              navigationService.navigate('Receive', tokenInfo);
            },
          });
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'receive' : 'receive1'} size={pTd(48)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Receive')}</TextM>
    </View>
  );
}
