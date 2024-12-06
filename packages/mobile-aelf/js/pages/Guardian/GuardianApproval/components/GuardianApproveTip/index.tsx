import React, { useCallback } from 'react';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';

export const GuardianApproveTip = () => {
  const onPress = useCallback(() => {
    const url = `https://doc.portkey.finance/docs/What-are-guardians-and-verifiers`;
    navigationService.navigate('ViewOnWebView', {
      title: '',
      url,
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
