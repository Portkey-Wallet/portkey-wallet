import { View, StyleSheet } from 'react-native';
import React from 'react';
import { pTd } from 'utils/unit';
import Lottie from 'lottie-react-native';

export interface IFlatListFooterLoadingProps {
  refreshing?: boolean;
}

export const FlatListFooterLoading = ({ refreshing }: IFlatListFooterLoadingProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {refreshing && (
          <Lottie style={styles.loadingStyle} source={require('assets/lottieFiles/spinnerDark.json')} autoPlay loop />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: pTd(4),
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
    width: pTd(16),
  },
});
