import React, { useEffect, useRef } from 'react';
import Lottie, { AnimatedLottieViewProps } from 'lottie-react-native';
import { AppState, AppStateStatus, NativeEventSubscription } from 'react-native';

export interface LottieActions {
  play(startFrame?: number, endFrame?: number): void;
  reset(): void;
  pause(): void;
  resume(): void;
}

export function LottieView(props: AnimatedLottieViewProps) {
  const appStateRef = useRef<AppStateStatus>();
  const listener = useRef<NativeEventSubscription>();
  const lottieRef = useRef<LottieActions>();
  useEffect(() => {
    if (props.autoPlay) {
      listener.current?.remove();
      listener.current = AppState.addEventListener('change', nextAppState => {
        if (appStateRef.current?.match(/inactive|background/) && nextAppState === 'active') lottieRef.current?.play();
        appStateRef.current = nextAppState;
      });
    }
    return () => {
      listener.current?.remove();
    };
  }, [props.autoPlay]);
  return <Lottie {...props} ref={lottieRef as any} />;
}
