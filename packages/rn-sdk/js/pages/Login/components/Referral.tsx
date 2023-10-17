import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import styles from '../styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import CommonButton from 'components/CommonButton';
import qrCodeImg from 'assets/image/pngs/QR-code.png';
import { PortkeyEntries } from 'config/entries';
import useBaseContainer from 'model/container/UseBaseContainer';
import { isWalletExists, isWalletUnlocked } from 'model/verify/after-verify';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { CheckPinProps, CheckPinResult } from 'pages/Pin/check-pin';
import { SignInPageProps, SignInPageResult } from 'components/entries/sign-in/SignInEntryPage';
import { sleep } from '@portkey-wallet/utils';
import Loading from 'components/Loading';
import TermsServiceButton from './TermsServiceButton';
import Divider from 'components/Divider';
import { defaultColors } from 'assets/theme';
import { PageLoginType } from '../types';

const TitleMap = {
  apple: 'Login with Apple',
  google: 'Login with Google',
  button: 'Login with Phone / Email',
};

export default function Referral({ setLoginType }: { setLoginType: (type: PageLoginType) => void }) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let onSuccess = (text = 'You have already logged in, page close in 3 seconds') => {
    console.log(text);
  };

  const { onFinish, navigateForResult } = useBaseContainer({
    entryName: PortkeyEntries.REFERRAL_ENTRY,
    onShow: async () => {
      if (await isWalletUnlocked()) {
        onSuccess();
      }
    },
  });

  onSuccess = (text = 'You have already logged in, page close in 3 seconds') => {
    CommonToast.success(text);
    setTimeout(() => {
      onFinish({
        status: 'success',
        data: {
          finished: true,
        },
      });
    }, 3000);
  };

  const pushToSignIn = () => {
    navigateForResult<SignInPageResult, SignInPageProps>(PortkeyEntries.SIGN_IN_ENTRY, {}, res => {
      if (res.status === 'success') {
        onSuccess();
      }
    });
  };

  const pushToSignUp = () => {
    navigateForResult<SignInPageResult, SignInPageProps>(PortkeyEntries.SIGN_UP_ENTRY, {}, res => {
      if (res.status === 'success') {
        onSuccess();
      }
    });
  };

  useEffectOnce(() => {
    baseCheck();
  });

  const baseCheck = async () => {
    if (await isWalletExists()) {
      if (await isWalletUnlocked()) {
        onSuccess('wallet is unlocked already, this page will close in 3 seconds');
      } else {
        const tryToUnlock = async () => {
          Loading.show();
          await sleep(1000);
          Loading.hide();
          navigateForResult<CheckPinResult, CheckPinProps>(PortkeyEntries.CHECK_PIN, {}, res => {
            if (res.status === 'success') {
              onSuccess();
            } else {
              CommonToast.failError('Try again');
              tryToUnlock();
            }
          });
        };
        tryToUnlock();
      }
    }
  };

  const onGoogleSign = useCallback(() => {
    // TODO: google sign in
  }, []);
  const onAppleSign = useCallback(() => {
    // TODO: apple sign in
  }, []);

  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter, GStyles.spaceBetween]}>
      <Touchable style={styles.iconBox} onPress={() => setLoginType(PageLoginType.qrCode)}>
        <Image source={qrCodeImg} style={styles.iconStyle} />
      </Touchable>
      <View style={GStyles.width100}>
        <CommonButton
          type="outline"
          onPress={onGoogleSign}
          title={TitleMap.google}
          icon={<Svg icon="google" size={24} />}
          containerStyle={pageStyles.outlineContainerStyle}
          titleStyle={[FontStyles.font3, pageStyles.outlineTitleStyle]}
        />

        <CommonButton
          type="outline"
          onPress={onAppleSign}
          title={TitleMap.apple}
          icon={<Svg icon="apple" size={24} />}
          containerStyle={pageStyles.outlineContainerStyle}
          titleStyle={[FontStyles.font3, pageStyles.outlineTitleStyle]}
        />

        <Divider title="OR" inset={true} style={pageStyles.dividerStyle} />
        <CommonButton type="primary" onPress={pushToSignIn} title={TitleMap.button} />
      </View>
      <Touchable style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.signUpTip]} onPress={pushToSignUp}>
        <TextL style={FontStyles.font3}>
          No account? <Text style={FontStyles.font4}>Sign up </Text>
        </TextL>
        <Svg size={pTd(20)} color={FontStyles.font4.color} icon="right-arrow2" />
      </Touchable>
      <TermsServiceButton />
    </View>
  );
}

const pageStyles = StyleSheet.create({
  outlineContainerStyle: {
    marginTop: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border1,
  },
  outlineTitleStyle: {
    marginLeft: 12,
  },
  dividerStyle: {
    marginVertical: 16,
  },
});
