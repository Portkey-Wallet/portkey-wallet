import React, { useEffect, useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { ScrollView, View } from 'react-native';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import GStyles from 'assets/theme/GStyles';
import { DappStoreItem } from '@portkey-wallet/store/store-eoa/dapp/type';
import { CommonButtonProps } from 'components/CommonButton';
import { GetSignatureParams } from '@portkey/provider-types';
import TransactionDataSection from '../TransactionDataSection';
import { TextL } from 'components/CommonText';
import { OverlayBottomSection } from '../OverlayBottomSection';
import { isIOS } from '@rneui/base';
import { useDecodeTx } from '@portkey-wallet/hooks/hooks-eoa/dapp';
import TransactionDataSectionWrapper from '../TransactionDataSectionWrapper';
import TitleInfoSection from '../TitleInfoSection';
import { makeStyles, useTheme } from '@rneui/themed';
import { CommonPromptCard, PromptCardType } from 'components/CommonPromptCard';

type SignModalPropsType = {
  dappInfo: DappStoreItem;
  signInfo: GetSignatureParams;
  realMethod: string;
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
  const [isManagerForwardCall, setIsManagerForwardCall] = useState<boolean>(false);
  const styles = getStyles();
  const { theme } = useTheme();
  useEffect(() => {
    (async () => {
      if (isCipherText) {
        try {
          // const res = await getDecodedTxData(
          //   '0a220a20a4ed11a0c86847b4c24111526f9e6a9174e142e28d26db8bdae761e6e32adbfd12220a2088881d4350a8c77c59a42fc86bbcd796b129e086da7e61d24fb86a6cbb6b2f3b18be9fe17022040608dfff2a124d616e61676572466f727761726443616c6c327f0a220a2009018c2fbd3ea94c99054cda666d23f1b1f6c90802a8b41c34a275a452f75c4412220a202791e992a57f28e75a11f13af2c0aec8b0eb35d2f048d42eba8901c92e0378dc1a085472616e73666572222b0a220a200c214bac7406d99ff80fc03401147840e7bde64cd85bddd4c3312627f2094be81203454c461801',
          // );
          const res = await getDecodedTxData(signInfo.data);
          if (res?.methodName && res?.params?.methodName && res?.methodName === 'ManagerForwardCall') {
            setIsManagerForwardCall(true);
            setClearText({
              methodName: res.params.methodName,
              params: res.params.args,
            });
          } else {
            setClearText({
              methodName: res.methodName,
              params: res.params,
            });
          }
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
        title: t('Sign'),
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
    <ModalBody
      modalBodyType="bottom"
      leftTitleDom={<TitleInfoSection viewStyle={{ paddingLeft: pTd(16) }} dappInfo={dappInfo} title="Sign message" />}
      onClose={onReject}>
      <View style={styles.contentWrap}>
        <ScrollView contentContainerStyle={GStyles.paddingBottom(100)}>
          {showWarning && (
            <CommonPromptCard
              style={{ marginTop: pTd(8) }}
              type={PromptCardType.WARNING}
              description={'Unknown authorization. Please proceed with caution.'}
            />
          )}
          <TextL
            style={{
              marginTop: pTd(24),
              color: theme.colors.textBase2,
            }}>
            {
              'Signing this message will prove you have ownership of the current account. Only sign messages from applications you trust.'
            }
          </TextL>

          {clearText ? (
            isManagerForwardCall ? (
              <TransactionDataSectionWrapper methodName={clearText.methodName} dataInfo={clearText.params} />
            ) : (
              <TransactionDataSection dataInfo={clearText} />
            )
          ) : (
            <TransactionDataSection dataInfo={signInfo} />
          )}
        </ScrollView>
      </View>
      <OverlayBottomSection bottomButtonGroup={ButtonList}>
        <TextL style={[styles.bottomText, GStyles.alignCenter]}>{t('Only sign if you trust this website')}</TextL>
      </OverlayBottomSection>
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

const getStyles = makeStyles(theme => ({
  contentWrap: {
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    paddingBottom: pTd(36),
  },
  bottomText: {
    marginTop: pTd(16),
    color: theme.colors.textBase2,
  },
}));
