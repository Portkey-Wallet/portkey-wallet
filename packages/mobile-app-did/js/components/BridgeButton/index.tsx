import React, { memo } from 'react';
import Svg from 'components/Svg';
import { View, TouchableOpacity, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { commonButtonStyle } from '../SendButton/style';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import WalletSecurityOverlay from 'components/WalletSecurityOverlay';
import { checkSecurity } from '@portkey-wallet/utils/securityTest';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import DisclaimerModal from 'components/DisclaimerModal';

type BridgeButtonPropsType = {
  wrapStyle?: StyleProp<ViewProps>;
};

const BridgeButton = (props: BridgeButtonPropsType) => {
  const { wrapStyle = {} } = props;
  const { t } = useLanguage();
  const { caHash } = useCurrentWalletInfo();

  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <TouchableOpacity
        style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]}
        onPress={async () => {
          if (!caHash) return;

          try {
            Loading.show();
            const isSafe = await checkSecurity(caHash);
            // TODO: back
            if (isSafe) return WalletSecurityOverlay.alert();

            // first time
            DisclaimerModal.showConnectModal();
          } catch (error) {
            CommonToast.failError(error);
          } finally {
            Loading.hide();
          }
        }}>
        {/* TODO:change icon */}
        <Svg icon="eBridge" size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={[commonButtonStyle.commonTitleStyle, commonButtonStyle.dashBoardTitleColorStyle]}>
        {t('Bridge')}
      </TextM>
    </View>
  );
};

export default memo(BridgeButton);
