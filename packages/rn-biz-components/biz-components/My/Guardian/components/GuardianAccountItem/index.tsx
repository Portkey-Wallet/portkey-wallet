import { TextM, TextS } from '@portkey-wallet/rn-components/components/CommonText';
import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { PRIVATE_GUARDIAN_ACCOUNT } from '@portkey-wallet/constants/constants-ca/guardian';
import Svg from '@portkey-wallet/rn-components/components/Svg';
import { LOGIN_GUARDIAN_TYPE_ICON } from '@portkey-wallet/rn-base/constants/misc';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import GStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { FontStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
import { AuthTypes } from '@portkey-wallet/rn-base/constants/guardian';

type GuardianAccountItemProps = {
  guardian?: UserGuardianItem;
};

const GuardianAccountItem = ({ guardian }: GuardianAccountItemProps) => {
  const guardianAccount = useMemo(() => {
    if (!guardian) return '';
    if (!AuthTypes.includes(guardian.guardianType)) {
      return guardian.guardianAccount;
    }
    if (guardian.isPrivate) return PRIVATE_GUARDIAN_ACCOUNT;
    return guardian.thirdPartyEmail || '';
  }, [guardian]);

  const renderGuardianAccount = useCallback(() => {
    if (!guardian) return <></>;
    if (!guardian.firstName) {
      return (
        <TextM numberOfLines={AuthTypes.includes(guardian.guardianType) ? 1 : 2} style={GStyles.flex1}>
          {guardianAccount}
        </TextM>
      );
    }
    return (
      <View style={GStyles.flex1}>
        <TextM style={styles.firstNameStyle} numberOfLines={1}>
          {guardian.firstName}
        </TextM>
        <TextS style={FontStyles.font3} numberOfLines={1}>
          {guardianAccount}
        </TextS>
      </View>
    );
  }, [guardianAccount, guardian]);

  return (
    <View style={styles.guardianTypeWrap}>
      {guardian && (
        <>
          <View style={[GStyles.center, styles.loginTypeIconWrap]}>
            <Svg icon={LOGIN_GUARDIAN_TYPE_ICON[guardian.guardianType]} size={pTd(16)} />
          </View>

          {renderGuardianAccount()}
        </>
      )}
    </View>
  );
};

export default memo(GuardianAccountItem);

const styles = StyleSheet.create({
  guardianTypeWrap: {
    height: pTd(56),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
    paddingHorizontal: pTd(16),
  },
  firstNameStyle: {
    marginBottom: pTd(2),
  },
  loginTypeIconWrap: {
    marginRight: pTd(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border6,
    backgroundColor: defaultColors.bg6,
    width: pTd(28),
    height: pTd(28),
    borderRadius: pTd(16),
  },
});
