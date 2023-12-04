import React, { useCallback, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { ScrollView, StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextL, TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import Svg, { IconName } from 'components/Svg';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import fonts from 'assets/theme/fonts';
import {
  EBRIDGE_DISCLAIMER_ARRAY,
  EBRIDGE_DISCLAIMER_TEXT_SHARE256_POLICY_ID,
} from '@portkey-wallet/constants/constants-ca/ebridge';
import myEvents from 'utils/deviceEvent';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import { getUrlObj } from '@portkey-wallet/utils/dapp/browser';
import Loading from 'components/Loading';

export type DisclaimerModalProps = {
  url: string;
  title: string;
  description: string;
  icon?: IconName;
};

const DisclaimerModal = ({ url, title, description, icon }: DisclaimerModalProps) => {
  const { t } = useLanguage();
  const { signPrivacyPolicy } = useDisclaimer();
  const [selected, setSelected] = useState(false);

  const onConfirm = useCallback(async () => {
    Loading.show();
    try {
      const { origin } = getUrlObj(url);
      await signPrivacyPolicy({ policyId: EBRIDGE_DISCLAIMER_TEXT_SHARE256_POLICY_ID, origin });
      OverlayModal.hide(false);
      navigationService.navigate('ProviderWebPage', { title, url });
    } catch (error) {
      console.log('error', error);
    }
    Loading.hide();
  }, [signPrivacyPolicy, title, url]);

  return (
    <ModalBody modalBodyType="bottom" title={t('Disclaimer')}>
      <View style={styles.contentWrap}>
        <View style={[GStyles.flexRow, GStyles.itemCenter]}>
          <Svg icon={icon || 'eBridgeFavIcon'} size={pTd(24)} />
          <TextM style={[FontStyles.font5, GStyles.marginLeft(pTd(8))]}>{title}</TextM>
        </View>
        <TextL style={[FontStyles.font5, fonts.mediumFont, GStyles.marginTop(pTd(8)), GStyles.marginBottom(pTd(16))]}>
          {description}
        </TextL>
        <ScrollView
          style={styles.scrollView}
          onLayout={e => {
            myEvents.nestScrollViewLayout.emit(e.nativeEvent.layout);
          }}>
          {EBRIDGE_DISCLAIMER_ARRAY.map((ele, index) => (
            <TextM key={index} style={[styles.contentText, ele.type !== 'text' && FontStyles.font5]}>
              {ele.content}
            </TextM>
          ))}
        </ScrollView>
        <Touchable style={[BGStyles.bg1, GStyles.flexRow, styles.agreeWrap]} onPress={() => setSelected(!selected)}>
          <Svg size={pTd(20)} icon={selected ? 'selected' : 'unselected'} />
          <TextM style={GStyles.marginLeft(pTd(8))}>I have read and agree to the terms.</TextM>
        </Touchable>
        <CommonButton disabled={!selected} type="primary" title={'Continue'} onPress={onConfirm} />
      </View>
    </ModalBody>
  );
};

export const showDisclaimerModal = (props: DisclaimerModalProps) => {
  OverlayModal.show(<DisclaimerModal {...props} />, {
    position: 'bottom',
    enabledNestScrollView: true,
  });
};

export default {
  showDisclaimerModal,
};

const styles = StyleSheet.create({
  contentWrap: {
    paddingHorizontal: pTd(20),
    paddingTop: pTd(8),
    flex: 1,
  },
  favIcon: {
    width: pTd(48),
    height: pTd(48),
    borderRadius: pTd(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    marginBottom: pTd(8),
    marginTop: pTd(24),
  },
  title: {
    marginBottom: pTd(2),
  },
  scrollView: {
    padding: pTd(12),
    backgroundColor: defaultColors.bg6,
    borderRadius: pTd(6),
    flex: 1,
  },
  contentText: {
    color: defaultColors.font3,
    marginBottom: pTd(8),
  },
  agreeWrap: {
    marginTop: pTd(26),
    marginBottom: pTd(20),
  },
  group: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    marginTop: pTd(8),
    borderRadius: pTd(6),
    ...GStyles.paddingArg(16, 16, 0),
  },
  walletTitle: {
    marginTop: pTd(24),
    paddingLeft: pTd(10),
  },
});
