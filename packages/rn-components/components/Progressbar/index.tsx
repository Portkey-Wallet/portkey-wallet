import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { pTd } from '../../utils/unit';
import { makeStyles } from '../../theme';
export interface IProgressbar {
  changeInnerBarWidth: (per: number) => void;
}

const Progressbar = forwardRef<IProgressbar>(function Progressbar(props, ref) {
  const [percentage, setPercentage] = useState<number>(0);

  const innerBarWidthStyle = useMemo(() => {
    const num = Number(percentage);
    return { width: `${num === 1 ? 0 : num * 100}%` as DimensionValue };
  }, [percentage]);

  useImperativeHandle(
    ref,
    () => ({
      changeInnerBarWidth(per: number) {
        setPercentage(per);
      },
    }),
    [],
  );
  const styles = useStyles();

  return (
    <View style={styles.progressBar}>
      <View style={[styles.innerBar, innerBarWidthStyle]} />
    </View>
  );
});

export default Progressbar;

const useStyles = makeStyles(theme => {
  return {
    progressBar: {
      zIndex: 100,
      height: pTd(2),
      width: screenWidth,
      position: 'absolute',
      top: 0,
      left: 0,
    },
    innerBar: {
      height: '100%',
      zIndex: 101,
      backgroundColor: theme.bg8,
    },
  };
});
