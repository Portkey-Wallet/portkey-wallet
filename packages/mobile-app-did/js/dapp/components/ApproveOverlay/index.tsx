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
import { TextXXXL } from 'components/CommonText';
import { OverlayBottomSection } from '../OverlayBottomSection';
import { ApproveParams } from 'dapp/dappOverlay';
import navigationService from 'utils/navigationService';
import { useAppDispatch } from 'store/hooks';
import { changeDrawerOpenStatus } from '@portkey-wallet/store/store-ca/discover/slice';
import { sleep } from '@portkey-wallet/utils';
import { ApprovalType } from '@portkey-wallet/types/verifier';

type SignModalPropsType = {
  dappInfo: DappStoreItem;
  approveParams: ApproveParams;
  onReject: () => void;
};
const ApproveModal = (props: SignModalPropsType) => {
  const { dappInfo, approveParams, onReject } = props;
  console.log(approveParams, '====approveInfo');
  const dispatch = useAppDispatch();
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
          navigationService.navigate('GuardianApproval', {
            approveParams,
            approvalType: ApprovalType.guardianApprove,
          });
          await sleep(200);
          dispatch(changeDrawerOpenStatus(false));
          OverlayModal.hide();
        },
      },
    ],
    [approveParams, dispatch, onReject, t],
  );

  return (
    <ModalBody modalBodyType="bottom" title="" onClose={onReject}>
      <View style={styles.contentWrap}>
        <DappInfoSection dappInfo={dappInfo} />
        <TextXXXL style={styles.signTitle}>Sign Message</TextXXXL>
        {/* <TransactionDataSection dataInfo={signInfo} /> */}
      </View>
      <OverlayBottomSection bottomButtonGroup={ButtonList} />
    </ModalBody>
  );
};

export const showApproveModal = (props: SignModalPropsType) => {
  OverlayModal.show(<ApproveModal {...props} />, {
    position: 'bottom',
    onCloseRequest: props.onReject,
  });
};

export default {
  showApproveModal,
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
