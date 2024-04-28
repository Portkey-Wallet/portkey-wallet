import { View, StyleSheet } from 'react-native';
import React from 'react';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import { TextS } from '../CommonText';
import { FontStyles } from '@portkey-wallet/rn-base/assets/theme/styles';
import LottieLoading from '../LottieLoading';

export interface IFlatListFooterLoadingProps {
  refreshing?: boolean;
}

export const FlatListFooterLoading = ({ refreshing }: IFlatListFooterLoadingProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {refreshing && (
          <>
            <LottieLoading lottieStyle={styles.loadingStyle} color="grey" type="custom" />
            <TextS style={FontStyles.font3}>Loading...</TextS>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: pTd(4),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: defaultColors.bg7,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: pTd(16),
    paddingTop: pTd(20),
    marginBottom: pTd(24),
  },
  content: {
    height: pTd(18),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadingStyle: {
    width: pTd(12),
    height: pTd(12),
    marginRight: pTd(4),
  },
});
