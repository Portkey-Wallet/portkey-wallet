import { TextL, TextM } from 'components/CommonText';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { PRIVATE_GUARDIAN_ACCOUNT } from '@portkey-wallet/constants/constants-ca/guardian';
import { AuthTypes } from 'constants/guardian';
import { makeStyles } from '@rneui/themed';

interface GuardianAccountItemProps {
  guardianItem: UserGuardianItem;
  wrapStyle?: object;
  firstNameStyle?: object;
}

export default function GuardianAccount({
  guardianItem,
  wrapStyle = {},
  firstNameStyle = {},
}: GuardianAccountItemProps) {
  const styles = getStyles();

  const guardianAccount = useMemo(() => {
    if (!AuthTypes.includes(guardianItem.guardianType)) {
      return guardianItem.guardianAccount;
    }
    if (guardianItem.isPrivate) return PRIVATE_GUARDIAN_ACCOUNT;
    return guardianItem.thirdPartyEmail || '';
  }, [guardianItem]);

  if (!guardianItem.firstName) {
    return (
      <TextL numberOfLines={AuthTypes.includes(guardianItem.guardianType) ? 1 : 2} style={wrapStyle}>
        {guardianAccount}
      </TextL>
    );
  }
  return (
    <View style={wrapStyle}>
      <TextL numberOfLines={1} style={[styles.firstNameText, firstNameStyle]}>
        {guardianItem.firstName}
      </TextL>
      <TextM style={styles.subNameText} numberOfLines={1}>
        {guardianAccount}
      </TextM>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  firstNameText: {
    lineHeight: pTd(22),
  },
  subNameText: {
    color: theme.colors.textBase2,
    lineHeight: pTd(20),
  },
}));
