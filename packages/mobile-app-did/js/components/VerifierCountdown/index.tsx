import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextM } from 'components/CommonText';
import Touchable from 'components/Touchable';
import useEffectOnce from 'hooks/useEffectOnce';
import React, { useCallback, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ViewStyleType } from 'types/styles';
import { clearBackgroundInterval, setBackgroundInterval } from 'utils/backgroundTimer';

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
    <View style={[GStyles.center, style]}>
      {isInvalidCode ? <TextM style={FontStyles.error}>{'Invalid code'}</TextM> : timeSection}
    </View>
  );
});

export default VerifierCountdown;

const styles = StyleSheet.create({
  resendTip: {
    color: defaultColors.font7,
  },
  resendText: {
    color: defaultColors.font4,
  },
});
