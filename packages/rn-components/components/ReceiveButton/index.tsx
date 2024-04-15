import React, { useMemo } from 'react';
import Svg from '../Svg';
import { StyleProp, View, ViewProps } from 'react-native';
import { useStyles } from '../SendButton/style';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import { TextM } from '../CommonText';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import TokenOverlay from '../TokenOverlay';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { pTd } from '../../utils/unit';
import GStyles from '../../theme/GStyles';
import Touchable from '../Touchable';

interface SendButtonType {
  currentTokenInfo?: TokenItemShowType;
  themeType?: 'dashBoard' | 'innerPage';
  wrapStyle?: StyleProp<ViewProps>;
}

export default function ReceiveButton(props: SendButtonType) {
  const { themeType = 'dashBoard', currentTokenInfo = {}, wrapStyle = {} } = props;
  const { t } = useLanguage();
  const commonButtonStyle = useStyles();
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
