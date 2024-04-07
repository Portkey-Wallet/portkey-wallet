import React from 'react';
import CommonSvg from '@portkey-wallet/rn-components/components/Svg';
import { TextM } from '@portkey-wallet/rn-components/components/CommonText';
import { useLanguage } from 'i18n/hooks';
import TokenOverlay from 'components/TokenOverlay';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import useBaseContainer from 'model/container/UseBaseContainer';
import { useUnlockedWallet } from 'model/wallet';
import { useCommonNetworkInfo } from '../TokenOverlay/hooks';
import { useCurrentNetworkType } from 'model/hooks/network';
import dashBoardBtnStyle, { innerPageStyles } from 'components/FaucetButton/style';
import { StyleProp, ViewProps, View, TouchableOpacity } from 'react-native';

interface SendButtonType {
  currentTokenInfo?: TokenItemShowType;
  themeType?: 'dashBoard' | 'innerPage';
  receiveButton?: any;
  wrapStyle?: StyleProp<ViewProps>;
}

export default function ReceiveButton(props: SendButtonType) {
  const { themeType = 'dashBoard', wrapStyle, currentTokenInfo } = props;
  const { t } = useLanguage();
  const { navigateTo } = useBaseContainer({
    entryName: PortkeyEntries.ASSETS_HOME_ENTRY,
  });
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;

  const { wallet } = useUnlockedWallet();
  const { defaultToken } = useCommonNetworkInfo();
  const currentNetwork = useCurrentNetworkType();

  return (
    <View style={[styles.buttonWrap, wrapStyle]}>
      <TouchableOpacity
        style={[styles.iconWrapStyle, GStyles.alignCenter]}
        onPress={() => {
          if (themeType === 'innerPage') {
            const tokenInfo = {
              token: currentTokenInfo,
              defaultToken: defaultToken,
              currentCaAddress: wallet?.caInfo.caAddress,
              currentNetwork,
            };
            navigateTo(PortkeyEntries.RECEIVE_TOKEN_ENTRY, { params: tokenInfo });
          } else {
            TokenOverlay.showTokenList({
              onFinishSelectToken: (tokenInfo: TokenItemShowType) => {
                navigateTo(PortkeyEntries.RECEIVE_TOKEN_ENTRY, { params: tokenInfo });
              },
            });
          }
        }}>
        <CommonSvg icon={themeType === 'dashBoard' ? 'receive' : 'receive1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Receive')}</TextM>
    </View>
  );
}
