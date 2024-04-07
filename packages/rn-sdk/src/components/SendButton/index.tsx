import React, { memo, useCallback, useMemo } from 'react';
import CommonSvg from '@portkey-wallet/rn-components/components/Svg';
import dashBoardBtnStyle, { innerPageStyles } from 'components/FaucetButton/style';
import { View, TouchableOpacity, StyleProp, ViewProps } from 'react-native';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { commonButtonStyle } from './style';
import AssetsOverlay from 'pages/Assets/Home/AssetsOverlay';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

interface SendButtonType {
  themeType?: 'dashBoard' | 'tokenInnerPage' | 'nftInnerPage';
  sentToken?: TokenItemShowType;
  wrapStyle?: StyleProp<ViewProps>;
}

const SendButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard', wrapStyle, sentToken } = props;
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;

  const { t } = useLanguage();

  const buttonTitleStyle = useMemo(
    () =>
      themeType === 'dashBoard'
        ? commonButtonStyle.dashBoardTitleColorStyle
        : commonButtonStyle.innerPageTitleColorStyle,
    [themeType],
  );

  const entryName = useMemo(() => {
    if (themeType === 'dashBoard') return PortkeyEntries.ASSETS_HOME_ENTRY;
    if (themeType === 'tokenInnerPage') return PortkeyEntries.TOKEN_DETAIL_ENTRY;
    return PortkeyEntries.NFT_DETAIL_ENTRY;
  }, [themeType]);

  const { navigateTo } = useBaseContainer({
    entryName,
  });

  const onPressButton = useCallback(() => {
    if (themeType !== 'dashBoard') {
      navigateTo<IToSendHomeParamsType>(PortkeyEntries.SEND_TOKEN_HOME_ENTRY, {
        params: {
          sendType: sentToken?.symbol ? 'token' : 'nft',
          assetInfo: sentToken as any,
          toInfo: {
            name: '',
            address: '',
          },
        },
      });
    } else {
      AssetsOverlay.showAssetList();
    }
  }, [navigateTo, sentToken, themeType]);

  return (
    <View style={[styles.buttonWrap, wrapStyle]}>
      <TouchableOpacity style={[styles.iconWrapStyle, GStyles.alignCenter]} onPress={onPressButton}>
        <CommonSvg icon={themeType === 'dashBoard' ? 'send' : 'send1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={[commonButtonStyle.commonTitleStyle, buttonTitleStyle]}>{t('Send')}</TextM>
    </View>
  );
};

export default memo(SendButton);
