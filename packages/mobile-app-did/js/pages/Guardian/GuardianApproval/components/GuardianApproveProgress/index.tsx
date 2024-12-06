import { ZERO } from '@portkey-wallet/constants/misc';
import { makeStyles } from '@rneui/themed';
import { CommonProgress } from 'components/CommonProgress';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';

export type TGuardianApproveProgressProps = {
  amount: number;
  length: number;
  style?: ViewStyle;
};
export const GuardianApproveProgress = ({ amount, length, style }: TGuardianApproveProgressProps) => {
  const styles = getStyles();

  const percent = useMemo(() => {
    if (!amount || !length) return 0;
    return ZERO.plus(amount).div(length).dp(2).toNumber();
  }, [amount, length]);

  const headerStr = useMemo(() => `${amount} / ${length} completed`, [amount, length]);

  const isCompleted = useMemo(() => amount >= length, [amount, length]);

  return (
    <View style={style}>
      <View style={styles.headerWrap}>
        <TextL style={styles.headerText}>{headerStr}</TextL>
        {isCompleted && <Svg size={pTd(22)} icon="check" />}
      </View>
      <CommonProgress percent={percent} />
    </View>
  );
};

const getStyles = makeStyles(theme => ({
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pTd(8),
  },
  headerText: {
    marginRight: pTd(8),
  },
}));
