import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';
import React, { useMemo } from 'react';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import styles from './styles';

export type SafeAreaBoxProps = SafeAreaViewProps & {
  pageSafeBottomPadding?: boolean;
};

export default function SafeAreaBox({ pageSafeBottomPadding, style, ...props }: SafeAreaBoxProps) {
  const isPageSafeBottomPadding = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isBottomEdge = !props.edges || props.edges.includes('bottom');
    return pageSafeBottomPadding || (!bottomBarHeight && isBottomEdge);
  }, [pageSafeBottomPadding, props.edges]);
  return (
    <SafeAreaView
      style={[styles.pageWrap, isPageSafeBottomPadding ? styles.pageSafeBottom : undefined, style]}
      {...props}
    />
  );
}
