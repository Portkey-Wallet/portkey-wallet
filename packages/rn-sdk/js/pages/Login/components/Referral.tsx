import React from 'react';
import { View, Text } from 'react-native';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import styles from '../styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { PageLoginType, PageType } from '../types';
import CommonButton from 'components/CommonButton';
import { PortkeyEntries } from 'config/entries';
import useBaseContainer from 'model/container/UseBaseContainer';
import { isWalletExists, isWalletUnlocked } from 'model/verify/after-verify';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { CheckPinProps, CheckPinResult } from 'pages/Pin/check-pin';
import { SignInPageProps, SignInPageResult } from 'components/entries/sign-in/SignInEntryPage';
import { sleep } from '@portkey-wallet/utils';
import Loading from 'components/Loading';

const TitleMap = {
  [PageType.login]: {
    apple: 'Login with Apple',
    google: 'Login with Google',
    button: 'Login with Phone / Email',
  },
  [PageType.signup]: {
    apple: 'Signup with Apple',
    google: 'Signup with Google',
    button: 'Signup with Phone / Email',
  },
};

export default function Referral({
  // setLoginType,
  type = PageType.login,
}: {
  setLoginType: (type: PageLoginType) => void;
  type?: PageType;
}) {
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

  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter, GStyles.spaceBetween]}>
      <View style={GStyles.width100}>
        <CommonButton type="primary" onPress={pushToSignIn} title={TitleMap[type].button} />
      </View>
      {type === PageType.login && (
        <Touchable style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.signUpTip]} onPress={pushToSignUp}>
          <TextL style={FontStyles.font3}>
            No account? <Text style={FontStyles.font4}>Sign up </Text>
          </TextL>
          <Svg size={pTd(20)} color={FontStyles.font4.color} icon="right-arrow2" />
        </Touchable>
      )}
    </View>
  );
}
