import { View } from 'react-native';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { makeStyles } from '@rneui/themed';
import { TextTitle } from 'components/CommonText';
import { CommonProgress } from 'components/CommonProgress';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

const MAX_PROGRESS_BEFORE_COMPLETE = 0.95;
const PROGRESS_STEP = 0.05;

export interface PrepareWalletProgressInterface {
  complete: () => void;
}
export const PrepareWalletProgress = forwardRef(function _PrepareWalletProgress(_, ref) {
  const styles = getStyles();
  const [percent, setPercent] = useState(0);
  const percentRef = useRef(percent);
  percentRef.current = percent;

  useEffect(() => {
    const timer = setInterval(() => {
      if (percentRef.current >= MAX_PROGRESS_BEFORE_COMPLETE) {
        return;
      }
      setPercent(pre => pre + PROGRESS_STEP);
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const complete = useCallback(() => {
    setPercent(1);
  }, []);

  useImperativeHandle(
    ref,
    (): PrepareWalletProgressInterface => {
      return {
        complete,
      };
    },
    [complete],
  );

  return (
    <View style={styles.containerStyle}>
      <TextTitle style={[styles.titleStyle, fonts.BGMediumFont]}>{'Preparing your wallet...'}</TextTitle>
      <CommonProgress percent={percent} />
    </View>
  );
});

const getStyles = makeStyles(_theme => ({
  containerStyle: {
    width: pTd(265),
    alignItems: 'center',
  },
  titleStyle: {
    marginBottom: pTd(16),
  },
}));
