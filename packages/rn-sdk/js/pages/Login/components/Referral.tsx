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
import { portkeyModulesEntity } from 'service/native-modules';
import { PortkeyEntries } from 'config/entries';

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
  const pushToSignIn = () => {
    portkeyModulesEntity.RouterModule.navigateTo(PortkeyEntries.SIGN_IN_ENTRY, PortkeyEntries.REFERRAL_ENTRY, '');
  };

  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter, GStyles.spaceBetween]}>
      <View style={GStyles.width100}>
        <CommonButton type="primary" onPress={pushToSignIn} title={TitleMap[type].button} />
      </View>
      {type === PageType.login && (
        <Touchable
          style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.signUpTip]}
          onPress={() =>
            portkeyModulesEntity.RouterModule.navigateTo(
              PortkeyEntries.SIGN_UP_ENTRY,
              PortkeyEntries.REFERRAL_ENTRY,
              '',
            )
          }>
          <TextL style={FontStyles.font3}>
            No account? <Text style={FontStyles.font4}>Sign up </Text>
          </TextL>
          <Svg size={pTd(20)} color={FontStyles.font4.color} icon="right-arrow2" />
        </Touchable>
      )}
    </View>
  );
}
