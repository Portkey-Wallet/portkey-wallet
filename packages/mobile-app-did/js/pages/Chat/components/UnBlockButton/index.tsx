import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { TextL, TextM } from 'components/CommonText';
import { useBlockAndReport } from '@portkey-wallet/hooks/hooks-ca/im';
import LottieLoading from 'components/LottieLoading';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import CommonToast from 'components/CommonToast';

type TUnBlockButtonPropsType = {
  blockedUserId: string;
};

const UnBlockButton = (props: TUnBlockButtonPropsType) => {
  const { blockedUserId } = props;
  const { unBlock } = useBlockAndReport();
  const [loading, setIsLoading] = useState(false);

  const unBlockAction = useCallback(async () => {
    if (loading) return;
    try {
      setIsLoading(true);
      await unBlock(blockedUserId);
      CommonToast.success('User unblocked');
    } catch (error) {
      CommonToast.fail('Unblock fail');
    } finally {
      setIsLoading(false);
    }
  }, [blockedUserId, loading, unBlock]);

  return (
    <Touchable style={styles.wrap} onPress={unBlockAction}>
      <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.flexCenter, GStyles.height('100%')]}>
        <TextM> {loading && <LottieLoading />}</TextM>
        <TextL style={[fonts.mediumFont, FontStyles.primaryColor, GStyles.marginLeft(pTd(8))]}>
          {loading ? 'Unblocking' : 'Unblock'}
        </TextL>
      </View>
    </Touchable>
  );
};

export default UnBlockButton;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: defaultColors.bg4,
    height: pTd(60),
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
  },
});
