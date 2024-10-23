import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import { TextH1, TextM } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';

export type TGuardianExpiredProps = {
  onTryAgain: () => void;
};
export const GuardianExpired = ({ onTryAgain }: TGuardianExpiredProps) => {
  const styles = getStyles();

  const onCancel = useCallback(() => {
    navigationService.goBack();
  }, []);

  return (
    <View style={[GStyles.flex1, GStyles.spaceBetween]}>
      <View>
        <Svg color={styles.headerIcon.color} size={pTd(32)} icon="warning" />
        <TextH1 style={styles.headerTitle}>{'Guardian Approval Expired'}</TextH1>
        <TextM style={styles.headerContent}>
          {'Your guardian approvals have expired. Please request new approvals to continue or cancel the process.'}
        </TextM>
      </View>
      <View>
        <CommonButton type="primary" onPress={onTryAgain}>
          {'Try Again'}
        </CommonButton>
        <CommonButton type="outline" buttonStyle={styles.cancelBtn} onPress={onCancel}>
          {'Cancel'}
        </CommonButton>
      </View>
    </View>
  );
};

const getStyles = makeStyles(theme => ({
  headerIcon: {
    color: theme.colors.iconDanger1,
  },
  headerTitle: {
    marginTop: pTd(16),
    ...fonts.BGMediumFont,
  },
  headerContent: {
    marginTop: pTd(16),
    lineHeight: pTd(20),
    color: theme.colors.textBase2,
  },
  cancelBtn: {
    marginTop: pTd(16),
  },
}));
