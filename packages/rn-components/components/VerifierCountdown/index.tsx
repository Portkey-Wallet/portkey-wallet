import { TextM } from '../CommonText';
import Touchable from '../Touchable';
import React, { useCallback, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { clearBackgroundInterval, setBackgroundInterval } from '../../utils/backgroundTimer';
import useEffectOnce from '../../utils/hooks/useEffectOnce';
import { ViewStyleType } from '../../theme/type';
import { makeStyles, useTheme } from '../../theme';

export type VerifierCountdownInterface = {
  resetTime: (t: number) => void;
};
export type VerifierCountdownProps = {
  onResend?: () => void;
  style?: ViewStyleType;
  isInvalidCode?: boolean;
};

const VerifierCountdown = forwardRef(function VerifierCountdown(
  { style, onResend, isInvalidCode = false }: VerifierCountdownProps,
  ref,
) {
  const [time, setTime] = useState<number>(0);
  const timer = useRef<NodeJS.Timer>();
  const startTimer = useCallback(() => {
    timer.current && clearBackgroundInterval(timer.current);
    timer.current = setBackgroundInterval(() => {
      setTime(t => {
        const newTime = t - 1;
        if (newTime <= 0) {
          timer.current && clearBackgroundInterval(timer.current);
          timer.current = undefined;
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, []);
  useEffectOnce(() => {
    startTimer();
    return () => {
      timer.current && clearBackgroundInterval(timer.current);
    };
  });
  const resetTime = useCallback(
    (t: number) => {
      setTime(t);
      startTimer();
    },
    [startTimer],
  );
  useImperativeHandle(ref, () => ({ resetTime }), [resetTime]);
  const styles = useStyles();
  const theme = useTheme();
  const timeSection = useMemo(
    () =>
      time > 0 ? (
        <TextM style={styles.resendTip}>Resend after {time}s</TextM>
      ) : (
        <Touchable onPress={onResend}>
          <TextM style={styles.resendText}>Resend</TextM>
        </Touchable>
      ),
    [onResend, time],
  );

  return (
    <View style={[theme.center, style]}>
      {isInvalidCode ? <TextM style={styles.error}>{'Invalid code'}</TextM> : timeSection}
    </View>
  );
});

export default VerifierCountdown;

const useStyles = makeStyles(theme => {
  return {
    resendTip: {
      color: theme.font7,
    },
    resendText: {
      color: theme.font4,
    },
    error: { color: theme.error },
  };
});
