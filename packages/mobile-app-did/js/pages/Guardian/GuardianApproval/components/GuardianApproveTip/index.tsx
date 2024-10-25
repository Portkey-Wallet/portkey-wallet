import React, { useCallback } from 'react';
import ActionSheet from 'components/ActionSheet';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { StyleSheet } from 'react-native';

export const GuardianApproveTip = () => {
  const onPress = useCallback(() => {
    ActionSheet.alert({
      title2: `You will need a certain number of guardians to confirm your action. The requirements differ depending on your guardian counts. If the total number is less than or equal to 3, approval from all is needed. If that figure is greater than 3, approval from a minimum of 60% is needed.`,
      buttons: [{ title: 'OK' }],
    });
  }, []);

  return (
    <Touchable style={styles.tipWrap} onPress={onPress}>
      <Svg size={pTd(24)} icon="question-mark2" />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  tipWrap: {
    paddingHorizontal: pTd(16),
  },
});
