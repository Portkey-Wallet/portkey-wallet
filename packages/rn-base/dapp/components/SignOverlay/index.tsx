import React, { useMemo } from 'react';
import OverlayModal from '@portkey-wallet/rn-components/components/OverlayModal';
import { ScrollView, StyleSheet, View } from 'react-native';
import { defaultColors } from '../../../assets/theme';
import { pTd } from '../../../utils/unit';
import { useLanguage } from '../../../i18n/hooks';
import { ModalBody } from '@portkey-wallet/rn-components/components/ModalBody';
import GStyles from '../../../assets/theme/GStyles';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { CommonButtonProps } from '@portkey-wallet/rn-components/components/CommonButton';

import DappInfoSection from '../DappInfoSection';
import { GetSignatureParams } from '@portkey/provider-types';
import TransactionDataSection from '../TransactionDataSection';
import { TextXXXL } from '@portkey-wallet/rn-components/components/CommonText';
import { OverlayBottomSection } from '../OverlayBottomSection';
import { isIOS } from '@rneui/base';

type SignModalPropsType = {
  dappInfo: DappStoreItem;
  signInfo: GetSignatureParams;
  onReject: () => void;
  onSign: () => void;
};
const SignModal = (props: SignModalPropsType) => {
  const { dappInfo, signInfo, onReject, onSign } = props;
  const { t } = useLanguage();

  const ButtonList = useMemo(
    () => [
      {
        title: t('Reject'),
        type: 'outline' as CommonButtonProps['type'],
        onPress: () => {
          onReject?.();
          OverlayModal.hide();
        },
      },
      {
        title: t('Approve'),
        type: 'primary' as CommonButtonProps['type'],
        onPress: async () => {
          onSign?.();
          OverlayModal.hide();
        },
      },
    ],
    [onReject, onSign, t],
  );

  return (
    <ModalBody modalBodyType="bottom" title="" onClose={onReject}>
      <View style={styles.contentWrap}>
        <DappInfoSection dappInfo={dappInfo} />
        <TextXXXL style={styles.signTitle}>Sign Message</TextXXXL>
        {/* fix ScrollView scroll */}
        <ScrollView contentContainerStyle={GStyles.paddingBottom(100)}>
          <TransactionDataSection dataInfo={signInfo} />
        </ScrollView>
      </View>
      <OverlayBottomSection bottomButtonGroup={ButtonList} />
    </ModalBody>
  );
};

export const showSignModal = (props: SignModalPropsType) => {
  OverlayModal.show(<SignModal {...props} />, {
    position: 'bottom',
    onCloseRequest: props.onReject,
    containerStyle: [!isIOS && GStyles.paddingBottom(0)],
    enabledNestScrollView: true,
  });
};

export default {
  showSignModal,
};

const styles = StyleSheet.create({
  contentWrap: {
    flex: 1,
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  title: {
    marginBottom: pTd(2),
  },
  method: {
    borderRadius: pTd(6),
    marginTop: pTd(24),
    textAlign: 'center',
    color: defaultColors.primaryColor,
    backgroundColor: defaultColors.bg9,
    ...GStyles.paddingArg(2, 8),
  },
  signTitle: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
    textAlign: 'center',
  },
});
