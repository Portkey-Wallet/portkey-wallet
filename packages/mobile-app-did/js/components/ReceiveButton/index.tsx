import React, { useMemo } from 'react';
import Svg from 'components/Svg';
import { StyleProp, View, ViewProps } from 'react-native';
import { commonButtonStyle } from '../SendButton/style';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import TokenOverlay from 'components/TokenOverlay';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import Touchable from 'components/Touchable';

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
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
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
        <Svg icon={themeType === 'dashBoard' ? 'receive' : 'receive1'} size={pTd(46)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Receive')}</TextM>
    </View>
  );
}
