import { TextL, TextM } from 'components/CommonText';
import React, { memo, useCallback, useMemo } from 'react';
import { makeStyles } from '@rneui/themed';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { PRIVATE_GUARDIAN_ACCOUNT } from '@portkey-wallet/constants/constants-ca/guardian';
import Svg from 'components/Svg';
import { GUARDIAN_ITEM_TYPE_ICON } from 'constants/misc';
import GStyles from 'assets/theme/GStyles';
import { DarkFontStyles } from 'assets/theme/styles';
import { AuthTypes } from 'constants/guardian';

type GuardianAccountItemProps = {
  guardian?: UserGuardianItem;
};

const GuardianAccountItem = ({ guardian }: GuardianAccountItemProps) => {
  const styles = getStyles();
  const guardianAccount = useMemo(() => {
    if (!guardian) return '';
    if (!AuthTypes.includes(guardian.guardianType)) {
      return guardian.guardianAccount;
    }
    if (guardian.isPrivate) return PRIVATE_GUARDIAN_ACCOUNT;
    return guardian.thirdPartyEmail || '';
  }, [guardian]);

  const renderGuardianAccount = useCallback(() => {
    if (!guardian) return null;
    if (!guardian.firstName) {
      return (
        <TextL numberOfLines={AuthTypes.includes(guardian.guardianType) ? 1 : 2} style={GStyles.flex1}>
          {guardianAccount}
        </TextL>
      );
    }
    return (
      <View style={[GStyles.flex1, styles.accountWrap]}>
        <TextL style={styles.firstNameStyle} numberOfLines={1}>
          {guardian.firstName}
        </TextL>
        <TextM style={[DarkFontStyles.textBase2, styles.accountText]} numberOfLines={1}>
          {guardianAccount}
        </TextM>
      </View>
    );
  }, [guardian, styles, guardianAccount]);

  return (
    <View style={styles.guardianTypeWrap}>
      {guardian && (
        <>
          <View style={[GStyles.center, styles.loginTypeIconWrap]}>
            <Svg icon={GUARDIAN_ITEM_TYPE_ICON[guardian.guardianType]} size={pTd(40)} />
          </View>

          {renderGuardianAccount()}
        </>
      )}
    </View>
  );
};

export default memo(GuardianAccountItem);

const getStyles = makeStyles(theme => ({
  guardianTypeWrap: {
    height: pTd(64),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: pTd(6),
    paddingHorizontal: pTd(16),
    backgroundColor: theme.colors.bgBase2,
  },
  accountWrap: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  firstNameStyle: {
    marginBottom: pTd(4),
  },
  accountText: {
    lineHeight: pTd(14),
  },
  loginTypeIconWrap: {
    marginRight: pTd(8),
    width: pTd(40),
    height: pTd(40),
    borderRadius: pTd(20),
  },
}));
