import React, { useMemo } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import GStyles from 'assets/theme/GStyles';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { CommonButtonProps } from 'components/CommonButton';

import DappInfoSection from '../DappInfoSection';
import { GetSignatureParams } from '@portkey/provider-types';
import TransactionDataSection from '../TransactionDataSection';
import { TextXXXL } from 'components/CommonText';

type SignModalPropsType = {
  dappInfo: DappStoreItem;
  signInfo: GetSignatureParams;
  onReject: () => void;
  onSign: () => void;
};
const SignModal = (props: SignModalPropsType) => {
  const { dappInfo, signInfo, onReject, onSign } = props;
  const { t } = useLanguage();

  const buttonList = useMemo(
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
        onPress: () => {
          onSign?.();
          OverlayModal.hide();
        },
      },
    ],
    [onReject, onSign, t],
  );

  return (
    <ModalBody modalBodyType="bottom" title="" bottomButtonGroup={buttonList} onClose={onReject}>
      <View style={styles.contentWrap}>
        <DappInfoSection dappInfo={dappInfo} />
        <TextXXXL style={styles.signTitle}>Sign Message</TextXXXL>
        <TransactionDataSection dataInfo={signInfo} />
      </View>
    </ModalBody>
  );
};

export const showSignModal = (props: SignModalPropsType) => {
  OverlayModal.show(<SignModal {...props} />, {
    position: 'bottom',
    enabledNestScrollView: true,
    onCloseRequest: props.onReject,
  });
};

export default {
  showSignModal,
};

const styles = StyleSheet.create({
  contentWrap: {
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
