import { TextM, TextS } from 'components/CommonText';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { ErrorType } from '@portkey-wallet/constants/constants-ca/common';

type GuardianThirdAccountProps = {
  account?: string;
  firstName?: string;
  guardianAccountError: ErrorType;
  onPress?: () => void;
  type: LoginType;
};

const LABEL_MAP: Record<any, string> = {
  [LoginType.Google]: 'Guardian Google',
  [LoginType.Apple]: 'Guardian Apple',
  [LoginType.Telegram]: 'Guardian Telegram',
};

const BUTTON_LABEL_MAP: Record<any, string> = {
  [LoginType.Google]: 'Click Add Google Account',
  [LoginType.Apple]: 'Click Add Apple ID',
  [LoginType.Telegram]: 'Click Add Telegram Account',
};

const GuardianThirdAccount = ({
  type,
  account,
  firstName,
  guardianAccountError,
  onPress,
}: GuardianThirdAccountProps) => {
  return (
    <>
      <TextM style={styles.accountLabel}>{LABEL_MAP[type] || ''}</TextM>
      {account ? (
        <View style={styles.thirdPartAccountWrap}>
          <View style={styles.thirdPartAccount}>
            {firstName && <TextM style={styles.firstNameStyle}>{firstName}</TextM>}
            <TextS style={[!!firstName && FontStyles.font3]} numberOfLines={1}>
              {account}
            </TextS>
          </View>
          {guardianAccountError.isError && (
            <TextS style={styles.thirdPartAccountError}>{guardianAccountError.errorMsg}</TextS>
          )}
        </View>
      ) : (
        <Touchable onPress={onPress}>
          <View style={styles.oAuthBtn}>
            <TextM style={[FontStyles.font4, FontStyles.weight500]}>{BUTTON_LABEL_MAP[type] || ''}</TextM>
          </View>
        </Touchable>
      )}
    </>
  );
};

export default memo(GuardianThirdAccount);

const styles = StyleSheet.create({
  accountLabel: {
    color: defaultColors.font3,
    marginLeft: pTd(8),
    marginBottom: pTd(8),
    lineHeight: pTd(20),
  },
  oAuthBtn: {
    height: pTd(56),
    paddingHorizontal: pTd(16),
    justifyContent: 'center',
    backgroundColor: defaultColors.bg1,
    marginBottom: pTd(24),
    borderRadius: pTd(6),
  },
  firstNameStyle: {
    marginBottom: pTd(2),
  },
  thirdPartAccount: {
    height: pTd(56),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
    paddingHorizontal: pTd(16),
    justifyContent: 'center',
  },
  thirdPartAccountWrap: {
    marginBottom: pTd(24),
  },
  thirdPartAccountError: {
    marginTop: pTd(4),
    marginLeft: pTd(8),
    color: defaultColors.error,
  },
});
