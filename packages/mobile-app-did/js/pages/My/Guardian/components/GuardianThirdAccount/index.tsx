import { TextL, TextM, TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { ErrorType } from '@portkey-wallet/constants/constants-ca/common';
import Svg from 'components/Svg';
import GStyles from 'assets/theme/GStyles';
import { makeStyles } from '@rneui/themed';

type GuardianThirdAccountProps = {
  account?: string;
  firstName?: string;
  guardianAccountError: ErrorType;
  onPress?: () => void;
  type: LoginType;
  clearAccount: () => void;
};

const LABEL_MAP: Record<any, string> = {
  [LoginType.Google]: 'Guardian Google',
  [LoginType.Apple]: 'Guardian Apple',
  [LoginType.Telegram]: 'Guardian Telegram',
  [LoginType.Twitter]: 'Guardian Twitter',
  [LoginType.Facebook]: 'Guardian Facebook',
};

const BUTTON_LABEL_MAP: Record<any, string> = {
  [LoginType.Google]: 'Click to add Google account',
  [LoginType.Apple]: 'Click to add Apple ID',
  [LoginType.Telegram]: 'Click to add Telegram account',
  [LoginType.Twitter]: 'Click to add Twitter account',
  [LoginType.Facebook]: 'Click to add Facebook account',
};

const GuardianThirdAccount = ({
  type,
  account,
  firstName,
  guardianAccountError,
  onPress,
  clearAccount,
}: GuardianThirdAccountProps) => {
  const styles = getStyles();
  return (
    <>
      <TextL style={styles.accountLabel}>{LABEL_MAP[type] || ''}</TextL>
      {account ? (
        <View style={styles.thirdPartAccountWrap}>
          <View style={styles.thirdPartAccount}>
            {firstName && <TextL style={styles.firstNameStyle}>{firstName}</TextL>}
            <TextM style={[!!firstName && FontStyles.fontBase2]} numberOfLines={1}>
              {account}
            </TextM>
            <Touchable style={styles.iconWrap} onPress={clearAccount}>
              <Svg icon="clear4" size={pTd(16)} />
            </Touchable>
          </View>
          {guardianAccountError.isError && (
            <TextS style={styles.thirdPartAccountError}>{guardianAccountError.errorMsg}</TextS>
          )}
        </View>
      ) : (
        <Touchable onPress={onPress}>
          <View style={styles.oAuthBtn}>
            <TextL style={[styles.oAuthBtnText]}>{BUTTON_LABEL_MAP[type] || ''}</TextL>
          </View>
        </Touchable>
      )}
    </>
  );
};

export default memo(GuardianThirdAccount);

const getStyles = makeStyles(theme => ({
  accountLabel: {
    color: theme.colors.textBase1,
    marginBottom: pTd(8),
    lineHeight: pTd(22),
  },
  oAuthBtn: {
    height: pTd(40),
    paddingHorizontal: pTd(16),
    justifyContent: 'center',
    backgroundColor: theme.colors.bgBase1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    marginBottom: pTd(24),
    borderRadius: pTd(8),
  },
  oAuthBtnText: {
    color: theme.colors.textBrand1,
    lineHeight: pTd(16),
  },
  firstNameStyle: {
    color: theme.colors.textBase1,
  },
  thirdPartAccount: {
    justifyContent: 'center',
  },
  thirdPartAccountWrap: {
    ...GStyles.paddingArg(12, 16),
    marginBottom: pTd(24),
    borderRadius: pTd(8),
    backgroundColor: theme.colors.bgBase1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
  },
  thirdPartAccountError: {
    marginTop: pTd(4),
    marginLeft: pTd(8),
    color: theme.colors.error,
  },
  iconWrap: {
    zIndex: 100,
    position: 'absolute',
    right: pTd(0),
  },
}));
