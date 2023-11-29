import React, { memo, useCallback } from 'react';
import Svg from 'components/Svg';
import { View, StyleProp, ViewProps } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { commonButtonStyle } from '../SendButton/style';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import DisclaimerModal from 'components/DisclaimerModal';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import navigationService from 'utils/navigationService';
import { useSecuritySafeCheckAndToast } from 'hooks/security';
import Touchable from 'components/Touchable';

type BridgeButtonPropsType = {
  wrapStyle?: StyleProp<ViewProps>;
};

const BridgeButton = (props: BridgeButtonPropsType) => {
  const { t } = useLanguage();
  const { wrapStyle = {} } = props;
  const { eBridgeUrl } = useCurrentNetworkInfo();
  const { checkDappIsConfirmed } = useDisclaimer();
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();

  const onPressButton = useCallback(async () => {
    try {
      Loading.show();
      if (!(await securitySafeCheckAndToast())) return;
      if (!checkDappIsConfirmed(eBridgeUrl || '')) return DisclaimerModal.showDisclaimerModal();
      navigationService.navigate('EBridge');
    } catch (error) {
      CommonToast.failError(error);
    } finally {
      Loading.hide();
    }
  }, [checkDappIsConfirmed, eBridgeUrl, securitySafeCheckAndToast]);

  return (
    <View style={[commonButtonStyle.buttonWrap, wrapStyle]}>
      <Touchable style={[commonButtonStyle.iconWrapStyle, GStyles.alignCenter]} onPress={onPressButton}>
        <Svg icon="eBridge" size={pTd(46)} />
      </Touchable>
      <TextM style={[commonButtonStyle.commonTitleStyle, commonButtonStyle.dashBoardTitleColorStyle]}>
        {t('Bridge')}
      </TextM>
    </View>
  );
};

export default memo(BridgeButton);
