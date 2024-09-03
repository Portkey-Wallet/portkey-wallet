import React, { useEffect, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { ScrollView, StyleSheet, View } from 'react-native';
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
import { TextS, TextXXXL } from 'components/CommonText';
import { OverlayBottomSection } from '../OverlayBottomSection';
import { isIOS } from '@rneui/base';
import { useDecodeTx } from '@portkey-wallet/hooks/hooks-ca/dapp';
import Svg from 'components/Svg';
import { BGStyles, BorderStyles, FontStyles } from 'assets/theme/styles';

type SignModalPropsType = {
  dappInfo: DappStoreItem;
  signInfo: GetSignatureParams;
  isCipherText: boolean;
  onReject: () => void;
  onSign: () => void;
};
const SignModal = (props: SignModalPropsType) => {
  const { dappInfo, signInfo, isCipherText, onReject, onSign } = props;
  const { t } = useLanguage();
  const getDecodedTxData = useDecodeTx();
  const [loading, setLoading] = useState(true);
  const [clearText, setClearText] = useState<any>();
  const [showWarning, setShowWarning] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      if (isCipherText) {
        try {
          // const res = await getDecodedTxData(
          //   '0a220a20a4ed11a0c86847b4c24111526f9e6a9174e142e28d26db8bdae761e6e32adbfd12220a2088881d4350a8c77c59a42fc86bbcd796b129e086da7e61d24fb86a6cbb6b2f3b18be9fe17022040608dfff2a124d616e61676572466f727761726443616c6c327f0a220a2009018c2fbd3ea94c99054cda666d23f1b1f6c90802a8b41c34a275a452f75c4412220a202791e992a57f28e75a11f13af2c0aec8b0eb35d2f048d42eba8901c92e0378dc1a085472616e73666572222b0a220a200c214bac7406d99ff80fc03401147840e7bde64cd85bddd4c3312627f2094be81203454c461801',
          // );
          const res = await getDecodedTxData(signInfo.data);
          console.log('res', res);
          setClearText({
            methodName: res.methodName,
            params: res.params,
          });
          setShowWarning(false);
        } catch (e) {
          setShowWarning(true);
        } finally {
          setLoading(false);
        }
      } else {
        setShowWarning(false);
        setLoading(false);
      }
    })();
  }, [getDecodedTxData, isCipherText, signInfo.data]);
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
  if (loading) {
    return null;
  }
  return (
    <ModalBody modalBodyType="bottom" title="" onClose={onReject}>
      <View style={styles.contentWrap}>
        <DappInfoSection dappInfo={dappInfo} />
        <TextXXXL style={styles.signTitle}>Sign Message</TextXXXL>
        {/* fix ScrollView scroll */}
        <ScrollView contentContainerStyle={GStyles.paddingBottom(100)}>
          {clearText ? <TransactionDataSection dataInfo={clearText} /> : <TransactionDataSection dataInfo={signInfo} />}
          {showWarning && (
            <View
              style={[
                GStyles.flexRow,
                GStyles.itemCenter,
                GStyles.radiusArg(pTd(8)),
                GStyles.hairlineBorder,
                BorderStyles.functionalYellowDisable,
                BGStyles.functionalYellowLight,
                GStyles.paddingArg(pTd(9), pTd(12)),
                GStyles.marginTop(pTd(12)),
              ]}>
              <Svg icon={'warning3'} size={pTd(16)} />
              <TextS style={[FontStyles.neutralPrimaryTextColor, GStyles.marginLeft(pTd(8))]}>
                Unrecognised authorisation. Please exercise caution and refrain from approving the transaction if you
                are uncertain.
              </TextS>
            </View>
          )}
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
    backgroundColor: defaultColors.brandLight,
    ...GStyles.paddingArg(2, 8),
  },
  signTitle: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
    textAlign: 'center',
  },
});
